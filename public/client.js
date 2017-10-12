let ASSET_URL = 'assets/';

let WINDOW_WIDTH = 750;
let WINDOW_HEIGHT = 500;
let game = new Phaser.Game(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: GameLoop
});
let WORLD_SIZE = { w: 750, h: 500 };

let zombie;
let other_zombies = {}
let tween;

function preload() {
    game.load.image('zombie', ASSET_URL + 'zombie.png')
}

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.world.setBounds(0, 0, WORLD_SIZE.w, WORLD_SIZE.h);
    game.stage.disableVisibilityChange = true;


    //MAKE ZOMBIE

    zombie.sprite = game.add.sprite(
        100,
        50,
        'zombie'
    );


    socket = io();
    socket.emit('new-zombie', {
        x: zombie.sprite.x,
        y: zombie.sprite.y,
        angle: zombie.sprite.rotation
    });
    socket.on('update-zombies', function(zombies_data) {
        let zombies_found = {};
        // console.log(zombies_data)
        // Loop over all the player data received
        for (let id in zombies_data) {
            // If the player hasn't been created yet
            if (other_zombies[id] == undefined && id !== socket.id) {
                // Make sure you don't create yourself
                let data = zombies_data[id];
                let p = createSprite(data.type, data.x, data.y, data.angle);
                other_zombies[id] = p;
                console.log('OTHERS', other_zombies)
                console.log(
                    'Created new player at (' + data.x + ', ' + data.y + ')'
                );
            }
            zombies_found[id] = true;

            // Update positions of other zombies
            // if (id !== socket.id) {
            //     // console.log('mewo', other_zombies[id].x)
            //     other_zombies[id].target_x = zombies_data[id].x; // Update target, not actual position, so we can interpolate
            //     other_zombies[id].target_y = zombies_data[id].y;
            //     other_zombies[id].target_rotation = zombies_data[id].angle;
            // }
        }
        // Check if a player is missing and delete them
        for (let id in other_zombies) {
            if (!zombies_found[id]) {
                other_zombies[id].destroy();
                delete other_zombies[id];
            }
        }
    });
   
        // Listen for other zombies connecting

}

function GameLoop() {
   zombie.update()
    // Interpolate all zombies to where they should be
    for (let id in other_zombies) {
        
        let p = other_zombies[id];
        
        // console.log('sjdflsdflksf', p.target_x)
        if (p.target_x != undefined) {
            p.x += (p.target_x - p.x) * 0.16;
            p.y += (p.target_y - p.y) * 0.16;
            // Intepolate angle while avoiding the positive/negative issue
            let angle = p.target_rotation;
            let dir = (angle - p.rotation) / (Math.PI * 2);
            dir -= Math.round(dir);
            dir = dir * Math.PI * 2;
            p.rotation += dir * 0.16;
        }
    }
   
}

function createSprite(type, x, y, angle) {
    // type is an int that can be between 1 and 6 inclusive
    game.physics.startSystem(Phaser.Physics.P2JS);
    sprite = game.add.sprite(x, y, 'zombie'); //changed  "ship" to "person"    +    '_1 to type
    sprite.friction = 0.95;
    sprite.rotation = angle;
    sprite.anchor.setTo(0.5, 0.5);
    return sprite;
}