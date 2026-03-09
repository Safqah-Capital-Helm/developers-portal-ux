import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { C } from '../../theme';

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="map-wrap">
      <div class="search-bar">
        <input [(ngModel)]="search" (keydown.enter)="doSearch()" placeholder="Search for a location..." class="search-input"/>
        <button (click)="doSearch()" class="search-btn">Search</button>
      </div>
      <canvas #mapCanvas [width]="540" [height]="220"
        (mousedown)="onMouse($event,'down')"
        (mousemove)="onMouse($event,'move')"
        (mouseup)="onMouse($event,'up')"
        (mouseleave)="dragging=false"
        [style.cursor]="dragging?'grabbing':'crosshair'"
        class="canvas">
      </canvas>
      <div class="footer">
        <span class="addr">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" [attr.stroke]="g500" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{addr}}
        </span>
        <span class="hint">Click or drag pin to set location</span>
      </div>
    </div>
  `,
  styles: [`
    .map-wrap { border-radius: 12px; overflow: hidden; border: 1.5px solid #e2e5e9; }
    .search-bar { display: flex; background: #fff; border-bottom: 1px solid #e2e5e9; }
    .search-input { flex: 1; padding: 11px 14px; border: none; outline: none; font-size: 13px; font-family: inherit; }
    .search-btn { padding: 0 14px; background: #e6f7ee; border: none; cursor: pointer; font-size: 12px; font-weight: 700; color: #00a15a; }
    .canvas { width: 100%; height: 220px; display: block; }
    .footer { padding: 8px 14px; background: #f8f9fa; border-top: 1px solid #e2e5e9; display: flex; justify-content: space-between; align-items: center; }
    .addr { font-size: 12px; color: #667085; display: flex; align-items: center; gap: 4px; }
    .hint { font-size: 11px; color: #98a2b3; }
  `]
})
export class MapPickerComponent implements AfterViewInit {
  @ViewChild('mapCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  search = '';
  addr = 'Dammam, Eastern Province';
  pin = { x: 250, y: 140 };
  dragging = false;
  g500 = C.g500;

  ngAfterViewInit() { this.draw(); }

  draw() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#e8f4e8'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    for (let i = 0; i < W; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
    for (let j = 0; j < H; j += 50) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(W, j); ctx.stroke(); }
    ctx.strokeStyle = '#d0ddd0'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, H * 0.4); ctx.lineTo(W, H * 0.35); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W * 0.3, 0); ctx.lineTo(W * 0.35, H); ctx.stroke();
    ctx.fillStyle = '#d5e8d5';
    [[60, 50, 80, 55], [200, 70, 100, 60], [380, 55, 90, 70], [80, 180, 110, 55]].forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath(); ctx.ellipse(this.pin.x, this.pin.y + 16, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = C.green;
    ctx.beginPath();
    ctx.moveTo(this.pin.x, this.pin.y + 10);
    ctx.bezierCurveTo(this.pin.x - 14, this.pin.y - 2, this.pin.x - 14, this.pin.y - 22, this.pin.x, this.pin.y - 26);
    ctx.bezierCurveTo(this.pin.x + 14, this.pin.y - 22, this.pin.x + 14, this.pin.y - 2, this.pin.x, this.pin.y + 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(this.pin.x, this.pin.y - 10, 4, 0, Math.PI * 2); ctx.fill();
  }

  onMouse(e: MouseEvent, type: string) {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    if (type === 'down') {
      if (Math.sqrt((x - this.pin.x) ** 2 + (y - this.pin.y) ** 2) < 30) { this.dragging = true; }
      else { this.pin = { x, y }; this.updateAddr(y, x); this.draw(); }
    }
    if (type === 'move' && this.dragging) {
      this.pin = { x: Math.max(0, Math.min(canvas.width, x)), y: Math.max(0, Math.min(canvas.height, y)) };
      this.updateAddr(y, x); this.draw();
    }
    if (type === 'up') { this.dragging = false; }
  }

  doSearch() {
    this.pin = { x: 180 + Math.random() * 150, y: 100 + Math.random() * 80 };
    this.addr = this.search || 'Dammam, Eastern Province';
    this.draw();
  }

  private updateAddr(y: number, x: number) {
    this.addr = `${(24.4 + y / 1000).toFixed(4)}°N, ${(39.6 + x / 1000).toFixed(4)}°E`;
  }
}
