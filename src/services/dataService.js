// Data Service for Ayursutra Patient Management
import patientsData from '../../data/patients.json';

class DataService {
  constructor() {
    // Initialize with JSON data first
    this.data = patientsData;
    
    // Ensure all patients have lastDietPlan and lastDietPlanDate properties
    this.data.patients = this.data.patients.map(patient => ({
      ...patient,
      lastDietPlan: patient.lastDietPlan || null,
      lastDietPlanDate: patient.lastDietPlanDate || null
    }));
    
    // Only try to load from localStorage if we're in the browser
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('ayursutra_patients');
      if (storedData) {
        this.data = JSON.parse(storedData);
      } else {
        this.saveToStorage();
      }
    }
  }

  saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ayursutra_patients', JSON.stringify(this.data));
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('patientsUpdated'));
    }
  }

  // Patient Methods
  getAllPatients() {
    return this.data.patients;
  }

  addPatient(patientData) {
    // Generate a new patient ID
    const newId = `P${String(this.data.patients.length + 1).padStart(3, '0')}`;
    
    // Create the new patient object
    const newPatient = {
      id: newId,
      name: patientData.fullName,
      age: parseInt(patientData.age),
      gender: patientData.gender,
      contact: patientData.phone,
      email: patientData.email || '',
      address: patientData.address || '',
      prakriti: patientData.prakriti,
      vikriti: patientData.vikriti,
      condition: patientData.medicalConditions || 'General Consultation',
      medications: patientData.medications || [],
      allergies: patientData.allergies || [],
      bloodPressure: '120/80', // Default values
      bloodSugar: '100 mg/dL',
      weight: parseFloat(patientData.weight),
      height: parseFloat(patientData.height),
      bmi: parseFloat((patientData.weight / Math.pow(patientData.height / 100, 2)).toFixed(1)),
      vataBalance: patientData.vikriti.vata,
      pittaBalance: patientData.vikriti.pitta,
      kaphaBalance: patientData.vikriti.kapha,
      priority: 'Medium', // Default priority
      lastVisit: new Date().toISOString(),
      compliance: 75, // Default compliance
      weightChange: 0,
      isOnline: false,
      tags: ['New Patient'],
      dietaryPreference: patientData.cuisines || ['vegetarian'],
      appointmentHistory: ['new'],
      lastDietPlan: null,
      lastDietPlanDate: null
    };

    // Add the new patient to the data
    this.data.patients.push(newPatient);
    
    // Update overview stats
    this.updateOverviewStats();
    
    // Save to localStorage and notify other components
    this.saveToStorage();
    
    return newPatient;
  }

  deletePatient(patientId) {
    const index = this.data.patients.findIndex(p => p.id === patientId);
    if (index !== -1) {
      const deletedPatient = this.data.patients[index];
      this.data.patients.splice(index, 1);
      
      // Also delete related data
      if (this.data.dietPlans) {
        this.data.dietPlans = this.data.dietPlans.filter(plan => plan.patientId !== patientId);
      }
      if (this.data.appointments) {
        this.data.appointments = this.data.appointments.filter(apt => apt.patientId !== patientId);
      }
      
      // Update overview stats
      this.updateOverviewStats();
      
      // Save to localStorage and notify other components
      this.saveToStorage();
      
      return deletedPatient;
    }
    return null;
  }

  updateOverviewStats() {
    const patients = this.data.patients;
    const vataCount = patients.filter(p => p.prakriti.toLowerCase() === 'vata').length;
    const pittaCount = patients.filter(p => p.prakriti.toLowerCase() === 'pitta').length;
    const kaphaCount = patients.filter(p => p.prakriti.toLowerCase() === 'kapha').length;
    const highPriorityCount = patients.filter(p => p.priority.toLowerCase() === 'high').length;
    const upcomingCount = patients.filter(p => p.tags.includes('Regular Patient')).length;
    
    this.data.overviewStats = {
      totalPatients: patients.length,
      vataPatients: vataCount,
      pittaPatients: pittaCount,
      kaphaPatients: kaphaCount,
      highPriority: highPriorityCount,
      upcomingAppointments: upcomingCount,
      averageCompliance: Math.round(patients.reduce((sum, p) => sum + p.compliance, 0) / patients.length),
      totalWeightLoss: Math.round(patients.reduce((sum, p) => sum + Math.abs(p.weightChange), 0) * 10) / 10,
      newPatientsThisMonth: patients.filter(p => p.tags.includes('New Patient')).length,
      completedAppointments: patients.length
    };
  }

  getPatientById(id) {
    return this.data.patients.find(patient => patient.id === id);
  }

  getPatientsByPrakriti(prakriti) {
    return this.data.patients.filter(patient => 
      patient.prakriti.toLowerCase() === prakriti.toLowerCase()
    );
  }

  getPatientsByPriority(priority) {
    return this.data.patients.filter(patient => 
      patient.priority.toLowerCase() === priority.toLowerCase()
    );
  }

  getPatientsByAgeGroup(minAge, maxAge) {
    return this.data.patients.filter(patient => 
      patient.age >= minAge && patient.age <= maxAge
    );
  }

  getPatientsByGender(gender) {
    return this.data.patients.filter(patient => 
      patient.gender.toLowerCase() === gender.toLowerCase()
    );
  }

  getPatientsByDietaryPreference(preference) {
    return this.data.patients.filter(patient => 
      patient.dietaryPreference.toLowerCase() === preference.toLowerCase()
    );
  }

  getOnlinePatients() {
    return this.data.patients.filter(patient => patient.isOnline);
  }

  getHighCompliancePatients(threshold = 80) {
    return this.data.patients.filter(patient => patient.compliance >= threshold);
  }

  getLowCompliancePatients(threshold = 70) {
    return this.data.patients.filter(patient => patient.compliance < threshold);
  }

  // Search Methods
  searchPatients(query) {
    const searchTerm = query.toLowerCase();
    return this.data.patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.id.toLowerCase().includes(searchTerm) ||
      patient.condition.toLowerCase().includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm)
    );
  }

  // Filter Methods
  filterPatients(filters) {
    let filteredPatients = [...this.data.patients];

    // Search query filter
    if (filters.search) {
      filteredPatients = this.searchPatients(filters.search);
    }

    // Prakriti filter
    if (filters.prakriti && filters.prakriti.length > 0) {
      filteredPatients = filteredPatients.filter(patient => 
        filters.prakriti.includes(patient.prakriti.toLowerCase())
      );
    }

    // Age group filter
    if (filters.ageGroup && filters.ageGroup.length > 0) {
      filteredPatients = filteredPatients.filter(patient => {
        return filters.ageGroup.some(ageRange => {
          switch (ageRange) {
            case "0-18": return patient.age >= 0 && patient.age <= 18;
            case "19-35": return patient.age >= 19 && patient.age <= 35;
            case "36-50": return patient.age >= 36 && patient.age <= 50;
            case "51-65": return patient.age >= 51 && patient.age <= 65;
            case "65+": return patient.age >= 65;
            default: return true;
          }
        });
      });
    }

    // Gender filter
    if (filters.gender && filters.gender.length > 0) {
      filteredPatients = filteredPatients.filter(patient => 
        filters.gender.includes(patient.gender.toLowerCase())
      );
    }

    // Dietary preference filter
    if (filters.dietaryPreference && filters.dietaryPreference.length > 0) {
      filteredPatients = filteredPatients.filter(patient => 
        filters.dietaryPreference.includes(patient.dietaryPreference.toLowerCase())
      );
    }

    // Appointment history filter
    if (filters.appointmentHistory && filters.appointmentHistory.length > 0) {
      filteredPatients = filteredPatients.filter(patient => {
        return filters.appointmentHistory.some(history => {
          switch (history) {
            case "new": return patient.tags.includes("New Patient");
            case "regular": return patient.tags.includes("Regular Patient");
            case "follow-up": return patient.tags.includes("Needs Follow-up");
            case "missed": return patient.priority === "High" && patient.compliance < 80;
            default: return true;
          }
        });
      });
    }

    return filteredPatients;
  }

  // Overview Stats
  getOverviewStats() {
    const baseStats = this.data.overviewStats;
    const appointments = this.getAllAppointments();
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate dynamic appointment statistics
    const todayAppointments = appointments.filter(apt => apt.date === today);
    const upcomingAppointments = this.getUpcomingAppointments(7);
    const completedAppointments = appointments.filter(apt => apt.status === 'Completed');
    const scheduledAppointments = appointments.filter(apt => apt.status === 'Scheduled');
    
    return {
      ...baseStats,
      todayAppointments: todayAppointments.length,
      upcomingAppointments: upcomingAppointments.length,
      completedAppointments: completedAppointments.length,
      scheduledAppointments: scheduledAppointments.length,
      totalAppointments: appointments.length
    };
  }

  // Diet Plans
  getAllDietPlans() {
    return this.data.dietPlans;
  }

  // Appointments
  getAllAppointments() {
    return this.data.appointments || [];
  }

  addAppointment(appointmentData) {
    if (!this.data.appointments) {
      this.data.appointments = [];
    }
    
    const newId = `APT${String(this.data.appointments.length + 1).padStart(3, '0')}`;
    const newAppointment = {
      id: newId,
      ...appointmentData,
      createdAt: new Date().toISOString()
    };
    
    this.data.appointments.push(newAppointment);
    this.saveToStorage();
    return newAppointment;
  }

  updateAppointment(id, updateData) {
    if (!this.data.appointments) return null;
    
    const index = this.data.appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      this.data.appointments[index] = { ...this.data.appointments[index], ...updateData };
      this.saveToStorage();
      return this.data.appointments[index];
    }
    return null;
  }

  deleteAppointment(id) {
    if (!this.data.appointments) return false;
    
    const index = this.data.appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      this.data.appointments.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getAppointmentsByPatientId(patientId) {
    return (this.data.appointments || []).filter(apt => apt.patientId === patientId);
  }

  getAppointmentsByDate(date) {
    return (this.data.appointments || []).filter(apt => apt.date === date);
  }

  getUpcomingAppointments(days = 7) {
    const today = new Date();
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return (this.data.appointments || []).filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= today && aptDate <= futureDate;
    }).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
  }

  getDietPlanById(id) {
    return this.data.dietPlans.find(plan => plan.id === id);
  }

  getDietPlansByPatientId(patientId) {
    return this.data.dietPlans.filter(plan => plan.patientId === patientId);
  }

  // Appointments
  getAllAppointments() {
    return this.data.appointments;
  }

  getAppointmentsByPatientId(patientId) {
    return this.data.appointments.filter(apt => apt.patientId === patientId);
  }

  getUpcomingAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return this.data.appointments.filter(apt => apt.date >= today);
  }

  // Notifications
  getAllNotifications() {
    return this.data.notifications;
  }

  getUnreadNotifications() {
    return this.data.notifications.filter(notification => !notification.read);
  }

  // Reports
  getAllReports() {
    return this.data.reports;
  }

  // Analytics Methods
  getDoshaDistribution() {
    const distribution = { vata: 0, pitta: 0, kapha: 0 };
    this.data.patients.forEach(patient => {
      distribution[patient.prakriti.toLowerCase()]++;
    });
    return distribution;
  }

  getComplianceStats() {
    const patients = this.data.patients;
    const total = patients.length;
    const highCompliance = patients.filter(p => p.compliance >= 80).length;
    const mediumCompliance = patients.filter(p => p.compliance >= 60 && p.compliance < 80).length;
    const lowCompliance = patients.filter(p => p.compliance < 60).length;
    
    return {
      total,
      highCompliance,
      mediumCompliance,
      lowCompliance,
      averageCompliance: Math.round(patients.reduce((sum, p) => sum + p.compliance, 0) / total)
    };
  }

  getWeightChangeStats() {
    const patients = this.data.patients;
    const totalWeightLoss = patients.reduce((sum, p) => sum + Math.abs(p.weightChange), 0);
    const patientsWithWeightLoss = patients.filter(p => p.weightChange < 0).length;
    const patientsWithWeightGain = patients.filter(p => p.weightChange > 0).length;
    
    return {
      totalWeightLoss: Math.round(totalWeightLoss * 10) / 10,
      patientsWithWeightLoss,
      patientsWithWeightGain,
      averageWeightChange: Math.round(patients.reduce((sum, p) => sum + p.weightChange, 0) / patients.length * 10) / 10
    };
  }

  // Utility Methods
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(timeString) {
    return timeString;
  }

  getPriorityColor(priority) {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getDoshaColor(dosha) {
    switch (dosha.toLowerCase()) {
      case 'vata': return 'from-blue-400 to-blue-600';
      case 'pitta': return 'from-red-400 to-red-600';
      case 'kapha': return 'from-green-400 to-green-600';
      default: return 'from-gray-400 to-gray-600';
    }
  }

  // Diet Plan Management
  addDietPlan(planData) {
    if (!this.data.dietPlans) {
      this.data.dietPlans = [];
    }
    
    const newId = `DP${String(this.data.dietPlans.length + 1).padStart(3, '0')}`;
    const newPlan = {
      id: newId,
      ...planData,
      createdAt: new Date().toISOString(),
      status: 'Active'
    };
    
    this.data.dietPlans.push(newPlan);
    
    // Update patient's last diet plan
    const patientIndex = this.data.patients.findIndex(p => p.id === planData.patientId);
    if (patientIndex !== -1) {
      this.data.patients[patientIndex].lastDietPlan = newId;
      this.data.patients[patientIndex].lastDietPlanDate = new Date().toISOString();
    }
    
    this.saveToStorage();
    return newPlan;
  }

  updateDietPlan(id, updateData) {
    if (!this.data.dietPlans) return null;
    
    const index = this.data.dietPlans.findIndex(plan => plan.id === id);
    if (index !== -1) {
      this.data.dietPlans[index] = { ...this.data.dietPlans[index], ...updateData };
      this.saveToStorage();
      return this.data.dietPlans[index];
    }
    return null;
  }

  getDietPlansByPatientId(patientId) {
    return (this.data.dietPlans || []).filter(plan => plan.patientId === patientId);
  }

  getActiveDietPlan(patientId) {
    const patientPlans = this.getDietPlansByPatientId(patientId);
    return patientPlans.find(plan => plan.status === 'Active') || null;
  }
}

// Create and export a singleton instance
const dataService = new DataService();
export default dataService;
