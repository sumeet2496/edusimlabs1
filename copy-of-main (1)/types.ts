
export interface SimulationDetail {
  id: string;
  title: string;
  description: string;
  internalRoute?: string;
}

export interface SimulationCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  subtopics: string[];
  simulations: SimulationDetail[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  content: string;
}

export interface NavItem {
  label: string;
  href: string;
}
