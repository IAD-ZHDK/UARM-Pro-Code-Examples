class PolarPositionSelector {
    constructor() {

      this.diam = (h + abs(Constrains.minHeight) + 10) / 2;
      this.activeAreaDiam = 600;
      this.activeAreaMinDiam = 80;
      this.Position = createVector(width / 2, (height / 2) - this.activeAreaMinDiam);
      this.lastChange = 0;
      this.heightChanged = false;
      this.dragging = false;
      this.dragRelease();
    }
  
    update() {
      // update the height if the height changed
      if (this.lastChange+200 < millis() && this.heightChanged) {
        this.heightChanged = false;
        this.lastChange = millis(); 
        console.log(this.lastChange +" "+ millis() );
        setPolarPosition();
      }
      this.display();
    }
  
    display() {
      fill(100);
      arc(width / 2, height / 2, this.activeAreaDiam, this.activeAreaDiam, PI, TWO_PI);
      fill(255);
      ellipse(width / 2, height / 2, this.activeAreaMinDiam * 2, this.activeAreaMinDiam * 2);
      fill(255, 0, 0);
      ellipse(this.Position.x, this.Position.y, this.diam, this.diam);
      if (this.dragging) {
        if (this.pointInArea(mouseX, mouseY)) {
          this.drag();
        }
      }
    }
  
    pointInArea(x, y) {
      return dist(x, y, width / 2, height / 2) <= this.activeAreaDiam / 2 &&
             dist(x, y, width / 2, height / 2) >= this.activeAreaMinDiam &&
             y < height / 2;
    }
  
    pointInCircle(x, y, a, b, r) {
      return dist(x, y, a, b) <= r;
    }
  
    drag() {
      this.Position.x = mouseX;
      this.Position.y = mouseY;
      let stretch = dist(this.Position.x, this.Position.y, width / 2, height / 2);
      stretch = map(stretch, this.activeAreaMinDiam, this.activeAreaDiam / 2, Constrains.minStretch, Constrains.maxStretch);
      let rotation = (90 + degrees(atan2(width / 2 - this.Position.x, height / 2 - this.Position.y)));
      s = int(stretch);
      r = int(rotation);

    }
  
    checkDragging(x, y) {
      this.dragging = this.pointInCircle(x, y, this.Position.x, this.Position.y, this.diam / 2);
    }
  
    setHeight(i) {
      this.heightChanged = true;
      h += i;
      h = constrain(h, Constrains.minHeight, Constrains.maxHeight);
      this.diam = (h + abs(Constrains.minHeight) + 10) / 2;
    }
  
    dragRelease() {
      if (this.dragging) {
        this.dragging = false;
        setPolarPosition();
      }
    }
  }
  
  function mousePressed() {
    selector.checkDragging(mouseX, mouseY);
  }
  
  function mouseReleased() {
    selector.dragRelease();
  }
  
  function mouseWheel(event) {
    let e = int(event.delta);
    if (e !== 0) {
      selector.setHeight(int(e));
    }
  }