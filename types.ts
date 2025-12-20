// Definimos la estructura exacta de un Proyecto
export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  demoUrl: string;
  category: 'frontend' | 'backend' | 'fullstack';
}

// Definimos la estructura de un Servicio
export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string; // Clase de FontAwesome
  price?: string; // Opcional
}