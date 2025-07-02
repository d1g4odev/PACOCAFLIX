import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="star-rating-container">
      <div class="star-rating" [class.readonly]="readonly">
        <span 
          *ngFor="let star of stars; let i = index"
          class="star"
          [class.filled]="i < (hoverRating || rating)"
          [class.half-filled]="isHalfStar(i)"
          [class.hoverable]="!readonly"
          (click)="!readonly && rate(i + 1)"
          (mouseenter)="!readonly && hover(i + 1)"
          (mouseleave)="!readonly && hover(0)">
          <span class="star-icon">★</span>
        </span>
      </div>
      <div *ngIf="showValue" class="rating-info">
        <span class="rating-value">{{ rating.toFixed(1) }}</span>
        <span class="rating-max">/5</span>
        <span class="rating-stars">⭐</span>
      </div>
    </div>
  `,
  styles: [`
    .star-rating-container {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .star-rating {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 4px 8px;
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 193, 7, 0.1));
      border-radius: 12px;
      border: 1px solid rgba(255, 215, 0, 0.3);
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.2);
    }
    
    .star {
      position: relative;
      cursor: pointer;
      transition: all 0.3s ease;
      user-select: none;
    }
    
    .star-icon {
      font-size: 22px;
      color: #444;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    
    .star.filled .star-icon {
      color: #FFD700;
      text-shadow: 
        0 0 5px rgba(255, 215, 0, 0.8),
        0 0 10px rgba(255, 215, 0, 0.6),
        0 1px 3px rgba(0,0,0,0.3);
      transform: scale(1.05);
    }
    
    .star.half-filled .star-icon {
      background: linear-gradient(90deg, #FFD700 50%, #444 50%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .star.hoverable:hover .star-icon {
      color: #FFC107;
      transform: scale(1.2);
      text-shadow: 
        0 0 8px rgba(255, 193, 7, 0.9),
        0 0 15px rgba(255, 193, 7, 0.7);
    }
    
    .rating-info {
      display: flex;
      align-items: center;
      gap: 2px;
      background: linear-gradient(135deg, #FFD700, #FFC107);
      padding: 3px 8px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(255, 215, 0, 0.3);
    }
    
    .rating-value {
      font-weight: bold;
      font-size: 14px;
      color: #333;
      text-shadow: 0 1px 2px rgba(255,255,255,0.5);
    }
    
    .rating-max {
      font-size: 12px;
      color: #666;
      opacity: 0.8;
    }
    
    .rating-stars {
      font-size: 12px;
      margin-left: 2px;
    }
    
    .star-rating.readonly {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 193, 7, 0.05));
      border-color: rgba(255, 215, 0, 0.2);
    }
    
    .star-rating.readonly .star {
      cursor: default;
    }
    
    /* Animação de brilho para estrelas preenchidas */
    @keyframes starGlow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    
    .star.filled .star-icon {
      animation: starGlow 2s ease-in-out infinite;
    }
    
    /* Efeito hover mais suave */
    .star.hoverable {
      transition: transform 0.2s ease;
    }
    
    .star.hoverable:hover {
      transform: translateY(-2px);
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Input() showValue: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  stars = Array(5).fill(0);
  hoverRating = 0;

  rate(rating: number) {
    if (!this.readonly) {
      this.rating = Math.min(5, Math.max(1, rating)); // Garantir entre 1 e 5
      this.ratingChange.emit(this.rating);
    }
  }

  hover(rating: number) {
    if (!this.readonly) {
      this.hoverRating = rating;
    }
  }

  isHalfStar(index: number): boolean {
    const ratingToCheck = this.hoverRating || this.rating;
    return ratingToCheck > index && ratingToCheck < index + 1;
  }

  get displayRating() {
    return Math.min(5, Math.max(0, this.hoverRating || this.rating));
  }
} 