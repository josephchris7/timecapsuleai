import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format time frame for display
export function formatTimeFrame(timeFrame: string): string {
  const timeMap: Record<string, string> = {
    '1m': '1 Month',
    '3m': '3 Months',
    '6m': '6 Months',
    '1y': '1 Year',
    '2y': '2 Years',
    '5y': '5 Years'
  };
  return timeMap[timeFrame] || timeFrame;
}

// Format context first letter to uppercase
export function formatContext(context: string): string {
  return context.charAt(0).toUpperCase() + context.slice(1);
}

// Helper function to scroll to bottom of a container
export function scrollToBottom(element: HTMLElement | null): void {
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
}

// Get icon name based on context
export function getContextIcon(context: string): string {
  const iconMap: Record<string, string> = {
    'product': 'category',
    'team': 'people',
    'revenue': 'trending_up',
    'strategy': 'lightbulb'
  };
  return iconMap[context] || 'help_outline';
}

// Format date for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}
