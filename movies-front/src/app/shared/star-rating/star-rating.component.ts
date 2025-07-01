import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="star-rating">
      <span 
        *ngFor="let star of stars; let i = index"
        class="star"
        [class.filled]="i < rating"
        [class.hoverable]="!readonly"
        (click)="!readonly && rate(i + 1)"
        (mouseenter)="!readonly && hover(i + 1)"
        (mouseleave)="!readonly && hover(0)">
        ★
      </span>
      <span *ngIf="showValue" class="rating-value">({{ rating }}/5)</span>
    </div>
  `,
  styles: [`
    .star-rating {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
    
    .star {
      font-size: 20px;
      color: #ddd;
      cursor: pointer;
      transition: color 0.2s ease;
      user-select: none;
    }
    
    .star.filled {
      color: #ffd700;
    }
    
    .star.hoverable:hover {
      color: #ffed4e;
      transform: scale(1.1);
    }
    
    .rating-value {
      margin-left: 8px;
      color: #666;
      font-size: 14px;
    }
    
    .star-rating[readonly] .star {
      cursor: default;
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
      this.rating = rating;
      this.ratingChange.emit(this.rating);
    }
  }

  hover(rating: number) {
    if (!this.readonly) {
      this.hoverRating = rating;
    }
  }

  get displayRating() {
    return this.hoverRating || this.rating;
  }
} 