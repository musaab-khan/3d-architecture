export const draw2DObject = (ctx, object) => {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
    
    switch(object.type) {
      case 'wall':
        ctx.beginPath();
        ctx.moveTo(object.x, object.y);
        ctx.lineTo(object.x + object.width, object.y);
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
        ctx.moveTo(object.x, object.y);
        ctx.lineTo(object.x - object.width / 2, object.y + object.height);
        ctx.lineTo(object.x + object.width / 2, object.y + object.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      default:
        break;
    }
  };
  