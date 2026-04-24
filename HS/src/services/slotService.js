// src/services/slotService.js
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { DOCTOR_TIMINGS } = require('../config/constants');
const emailService = require('./emailService');

class SlotService {
  
  // Generate slots for a doctor for a specific date
  async generateSlotsForDate(doctorId, date) {
    const startHour = DOCTOR_TIMINGS.START_HOUR;
    const endHour = DOCTOR_TIMINGS.END_HOUR;
    const lunchStart = DOCTOR_TIMINGS.LUNCH_START;
    const lunchEnd = DOCTOR_TIMINGS.LUNCH_END;
    const slotDuration = DOCTOR_TIMINGS.SLOT_DURATION;
    
    const slots = [];
    let currentTime = new Date(date);
    currentTime.setHours(startHour, 0, 0, 0);
    
    const endTime = new Date(date);
    endTime.setHours(endHour, 0, 0, 0);
    
    while (currentTime < endTime) {
      const currentHour = currentTime.getHours();
      
      // Skip lunch time
      if (currentHour >= lunchStart && currentHour < lunchEnd) {
        currentTime.setHours(lunchEnd, 0, 0, 0);
        continue;
      }
      
      const timeString = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      slots.push({
        time: timeString,
        isBooked: false
      });
      
      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }
    
    const doctor = await Doctor.findById(doctorId);
    if (doctor) {
      const existingSlotIndex = doctor.availableSlots.findIndex(
        slot => slot.date.toDateString() === new Date(date).toDateString()
      );
      
      const slotData = {
        date: new Date(date),
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`,
        slots: slots,
        totalSlots: slots.length,
        bookedSlots: 0,
        isFullyBooked: false
      };
      
      if (existingSlotIndex !== -1) {
        doctor.availableSlots[existingSlotIndex] = slotData;
      } else {
        doctor.availableSlots.push(slotData);
      }
      
      await doctor.save();
    }
    
    return slots;
  }
  
  // Check if a specific slot is available
  async isSlotAvailable(doctorId, date, timeSlot) {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return false;
    
    const slotData = doctor.availableSlots.find(
      slot => slot.date.toDateString() === new Date(date).toDateString()
    );
    
    if (!slotData) return false;
    
    const slot = slotData.slots.find(s => s.time === timeSlot);
    return slot && !slot.isBooked;
  }
  
  // Book a slot
  async bookSlot(doctorId, date, timeSlot, patientId, appointmentId) {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new Error('Doctor not found');
    
    const slotData = doctor.availableSlots.find(
      slot => slot.date.toDateString() === new Date(date).toDateString()
    );
    
    if (!slotData) throw new Error('No slots available for this date');
    
    const slot = slotData.slots.find(s => s.time === timeSlot);
    if (!slot || slot.isBooked) throw new Error('Slot not available');
    
    slot.isBooked = true;
    slot.bookedBy = patientId;
    slot.appointmentId = appointmentId;
    slotData.bookedSlots++;
    
    if (slotData.bookedSlots >= slotData.totalSlots) {
      slotData.isFullyBooked = true;
    }
    
    await doctor.save();
    return true;
  }
  
  // Release a slot (when appointment is cancelled)
  async releaseSlot(doctorId, date, timeSlot) {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return false;
    
    const slotData = doctor.availableSlots.find(
      slot => slot.date.toDateString() === new Date(date).toDateString()
    );
    
    if (!slotData) return false;
    
    const slot = slotData.slots.find(s => s.time === timeSlot);
    if (slot) {
      slot.isBooked = false;
      slot.bookedBy = null;
      slot.appointmentId = null;
      slotData.bookedSlots--;
      slotData.isFullyBooked = false;
      await doctor.save();
    }
    
    return true;
  }
  
  // Get available slots for a doctor on a date
  // async getAvailableSlots(doctorId, date) {
  //   const doctor = await Doctor.findById(doctorId);
  //   if (!doctor) return [];
    
  //   let slotData = doctor.availableSlots.find(
  //     slot => slot.date.toDateString() === new Date(date).toDateString()
  //   );
    
  //   if (!slotData) {
  //     await this.generateSlotsForDate(doctorId, date);
  //     doctor.reload();
  //     slotData = doctor.availableSlots.find(
  //       slot => slot.date.toDateString() === new Date(date).toDateString()
  //     );
  //   }
    
  //   if (!slotData) return [];
    
  //   return slotData.slots.filter(slot => !slot.isBooked);
  // }
  async getAvailableSlots(doctorId, date) {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return [];
  
  let slotData = doctor.availableSlots.find(
    slot => slot.date.toDateString() === new Date(date).toDateString()
  );
  
  if (!slotData) {
    await this.generateSlotsForDate(doctorId, date);
    // doctor.reload();  // ❌ IS LINE KO HATAO
    
    // ✅ Doctor ko fresh fetch karo (instead of reload)
    const freshDoctor = await Doctor.findById(doctorId);
    slotData = freshDoctor.availableSlots.find(
      slot => slot.date.toDateString() === new Date(date).toDateString()
    );
  }
  
  if (!slotData) return [];
  
  return slotData.slots.filter(slot => !slot.isBooked);
}
  
  // Auto-reschedule remaining appointments when doctor finishes early
  async autoRescheduleRemainingAppointments(doctorId, date, currentTime) {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return;
    
    const slotData = doctor.availableSlots.find(
      slot => slot.date.toDateString() === new Date(date).toDateString()
    );
    
    if (!slotData) return;
    
    // Find appointments after current time
    const remainingSlots = slotData.slots.filter(slot => {
      const slotTime = new Date(`${date} ${slot.time}`);
      return !slot.isBooked && slotTime > currentTime;
    });
    
    if (remainingSlots.length === 0) {
      // Doctor finished early, release all slots after current time
      for (let slot of slotData.slots) {
        const slotTime = new Date(`${date} ${slot.time}`);
        if (slotTime > currentTime && !slot.isBooked) {
          slot.isBooked = false;
        }
      }
      await doctor.save();
    }
  }
  
  // Check and reschedule overflow appointments
  async handleOverflowAppointments(doctorId, date) {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return;
    
    const endHour = DOCTOR_TIMINGS.END_HOUR;
    const endTime = new Date(date);
    endTime.setHours(endHour, 0, 0, 0);
    
    const currentTime = new Date();
    
    if (currentTime > endTime) {
      // Find all pending appointments for this doctor on this date
      const pendingAppointments = await Appointment.find({
        doctorId: doctorId,
        date: {
          $gte: new Date(date).setHours(0, 0, 0),
          $lt: new Date(date).setHours(23, 59, 59)
        },
        status: { $in: ['confirmed', 'pending'] }
      });
      
      for (let appointment of pendingAppointments) {
        // Reschedule to next available day
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        let rescheduled = false;
        
        // Try next 7 days
        for (let i = 1; i <= 7; i++) {
          const targetDate = new Date(date);
          targetDate.setDate(targetDate.getDate() + i);
          
          const availableSlots = await this.getAvailableSlots(doctorId, targetDate);
          
          if (availableSlots.length > 0) {
            const newSlot = availableSlots[0];
            
            // Update appointment
            appointment.rescheduleHistory.push({
              oldDate: appointment.date,
              oldTimeSlot: appointment.timeSlot,
              newDate: targetDate,
              newTimeSlot: newSlot.time,
              reason: 'Doctor time overflow',
              rescheduledAt: new Date()
            });
            
            appointment.date = targetDate;
            appointment.timeSlot = newSlot.time;
            appointment.status = 'auto_rescheduled';
            appointment.isAutoRescheduled = true;
            
            await appointment.save();
            
            // Book new slot
            await this.bookSlot(doctorId, targetDate, newSlot.time, appointment.patientId, appointment._id);
            
            // Send email notification
            const patient = await User.findById(appointment.patientId);
            if (patient) {
              await emailService.sendAutoRescheduleNotification(
                patient.email,
                patient.name,
                { date: appointment.rescheduleHistory[0].oldDate, timeSlot: appointment.rescheduleHistory[0].oldTimeSlot },
                { date: targetDate, timeSlot: newSlot.time }
              );
            }
            
            rescheduled = true;
            break;
          }
        }
        
        if (!rescheduled) {
          appointment.status = 'cancelled';
          appointment.cancellationReason = 'No available slots for rescheduling';
          await appointment.save();
        }
      }
    }
  }
}

module.exports = new SlotService();