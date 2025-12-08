export interface ClassData {
  _id: string;
  name: string;
  code: string;
  schedule: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  allowedRadius?: number;
  status?: "On Time" | "Cancelled" | "Rescheduled";
  createdBy: string;
}

export interface ApiResponse {
  success: boolean;
  data?: ClassData | ClassData[];
  error?: string;
}



export interface AttendanceStatusResponse {
  success: boolean;
  data?: { isPresent: boolean };
  error?: string;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}


export interface ClassForm {
  _id?: string;
  name: string;
  code: string;
  allowedRadius: number;
  location: {
    latitude: number;
    longitude: number;
  };
  schedule: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room: string;
  };
  createdBy: string;
};
