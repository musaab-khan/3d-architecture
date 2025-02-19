export const draw2DObject = (ctx, object) => {
    // Highlight selected objects
    if (object.isSelected) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
    }
    
    ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
    
    switch(object.type) {
      case 'wall':
        ctx.beginPath();
        ctx.moveTo(object.x - object.width/2, object.y);
        ctx.lineTo(object.x + object.width/2, object.y);
        ctx.stroke();
        break;
      case 'ball':
        ctx.beginPath();
        ctx.arc(object.x, object.y, object.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case 'pyramid':
        ctx.beginPath();
        ctx.moveTo(object.x, object.y - object.height/2);
        ctx.lineTo(object.x - object.width / 2, object.y + object.height/2);
        ctx.lineTo(object.x + object.width / 2, object.y + object.height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      default:
        // Default fallback - draw a rectangle
        ctx.beginPath();
        ctx.rect(
          object.x - object.width / 2,
          object.y - object.height / 2,
          object.width,
          object.height
        );
        ctx.fill();
        ctx.stroke();
        break;
    }
  };