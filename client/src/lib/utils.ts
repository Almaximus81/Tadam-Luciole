import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get a random item from an array
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Format date to a more readable format
export function formatDate(date: Date | null): string {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date));
}

// Generate a congratulatory message
export function getRandomCongrats(): string {
  const messages = [
    'Great job!',
    'Awesome work!',
    'You did it!',
    'Way to go!',
    'Task crushed!',
    'Nice one!'
  ];
  
  return getRandomItem(messages);
}

// Create confetti elements
export function createConfetti(container: HTMLElement) {
  if (!container) return;
  
  container.innerHTML = '';
  
  const colors = ['#00A8A8', '#9F7AEA', '#FFD166', '#00B2CA'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'absolute w-2.5 h-2.5 opacity-0';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animation = `confetti-animation ${Math.random() * 1 + 0.5}s ${Math.random() * 0.5}s ease-out forwards`;
    container.appendChild(confetti);
  }
}
