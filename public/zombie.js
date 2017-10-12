zombie = {
    sprite: null, //Will hold the sprite when it's created
    zombieManager: false,
    speed_x: 0, // This is the speed it's currently moving at
    speed_y: 0,
    speed: 0.5, // This is the parameter for how fast it should move
    friction: 0.95,
    shot: false,
    update: function() {
        let me = this.sprite;
        me.smoothed = false;
        // console.log(me.body)
        // //  Create our physics body. A circle assigned the playerCollisionGroup
        game.physics.p2.enable(me);
        me.body.setZeroDamping();
        me.body.fixedRotation = true;
        me.body.setZeroVelocity();
        
        tween = game.add.tween(me.body).to( {
            x: [600, 100]}, 4000, 
            Phaser.Easing.Sinusoidal.Out, true);
            tween.start()
        tween.loop()

        // Move north
        // if (
        //     game.input.keyboard.isDown(Phaser.Keyboard.UP) ||
        //     game.input.keyboard.isDown(Phaser.Keyboard.W)
        // ) {
        //     me.body.moveUp(200);
        //     me.rotation = 3.14159;
        // }

        // // Move east
        // if (
        //     game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
        //     game.input.keyboard.isDown(Phaser.Keyboard.D)
        // ) {
        //     me.rotation = 4.71239;
        //     me.body.moveRight(200);
        // }

        // // Move west
        // if (
        //     game.input.keyboard.isDown(Phaser.Keyboard.LEFT) ||
        //     game.input.keyboard.isDown(Phaser.Keyboard.A)
        // ) {
        //     me.rotation = 1.5708;
        //     me.body.moveLeft(200);
        // }

        // // Move south
        // if (
        //     game.input.keyboard.isDown(Phaser.Keyboard.DOWN) ||
        //     game.input.keyboard.isDown(Phaser.Keyboard.S)
        // ) {
        //     me.body.moveDown(200);
        //     me.rotation = 0;
        // }

        // Shoot bullet
        if (game.input.activePointer.leftButton.isDown && !this.shot) {
            let speed_x = Math.cos(me.rotation + Math.PI / 2) * 20;
            let speed_y = Math.sin(me.rotation + Math.PI / 2) * 20;
            this.shot = true;
            
            // Tell the server we shot a bullet
            socket.emit('shoot-bullet', {
                x: me.x + 30,
                y: me.y - 30,
                angle: me.rotation,
                speed_x: speed_x,
                speed_y: speed_y
            });
        }
        if (!game.input.activePointer.leftButton.isDown) this.shot = false;
        // To make player flash when they are hit, set player.spite.alpha = 0
        if (me.alpha < 1) {
            me.alpha += (1 - me.alpha) * 0.16;
        } else {
            me.alpha = 1;
        }
        // Tell the server we've moved
        socket.emit('move-player', { x: me.x, y: me.y, angle: me.rotation });
    }
};

