const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/resized-cyberpunk-street.png',
})

const player = new Fighter({
    position: {
        x: 75,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/Hero/Idle.png',
    framesMax: 11,
    scale: 2.5,
    offset: {
        x: 225,
        y: 135
    },
    sprites: {
        idle: {
            imageSrc: './img/Hero/Idle.png',
            framesMax: 11
        },
        run: {
            imageSrc: './img/Hero/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Hero/Jump.png',
            framesMax: 3
        },
        fall: {
            imageSrc: './img/Hero/Fall.png',
            framesMax: 3
        },
        attack1: {
            imageSrc: './img/Hero/Attack1.png',
            framesMax: 7
        },
        takeHit: {
            imageSrc: './img/Hero/Take Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/Hero/Death.png',
            framesMax: 11
        }
    },
    hitBox: {
        offset: {
            x: 100,
            y: 55
        },
        width: 120,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 900,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/Villain/Idle.png',
    framesMax: 11,
    scale: 3,
    offset: {
        x: 185,
        y: 99
    },
    sprites: {
        idle: {
            imageSrc: './img/Villain/Idle.png',
            framesMax: 11
        },
        run: {
            imageSrc: './img/Villain/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Villain/Jump.png',
            framesMax: 4
        },
        fall: {
            imageSrc: './img/Villain/Fall.png',
            framesMax: 4
        },
        attack1: {
            imageSrc: './img/Villain/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/Villain/Take Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/Villain/Death.png',
            framesMax: 9
        }
    },
    hitBox: {
        offset: {
            x: -125,
            y: 53
        },
        width: 125,
        height: 53
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    l: {
        pressed: false
    },
    j: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.05)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // Player Movement Logic
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // Player Jump & Fall
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // Enemy Movement Logic
    if (keys.j.pressed && enemy.lastKey === 'j') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.l.pressed && enemy.lastKey === 'l') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // Enemy Jump & Fall
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // Player On Hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && player.isHitting && player.framesCurrent === 4
        ) {
        enemy.takeHit()
        player.isHitting = false
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // Player Misses
    if (player.isHitting && player.framesCurrent === 4) {
        player.isHitting = false
    }

    // Enemy On Hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) && enemy.isHitting && enemy.framesCurrent === 2
        ) {
        player.takeHit()
        enemy.isHitting = false
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    // Enemy Misses
    if (enemy.isHitting && enemy.framesCurrent === 2) {
        enemy.isHitting = false
    }

    // Game Over
    if (enemy.health <= 0 || player.health <= 0) {
        chooseChamp({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
    
    switch (event.key) {
        // Player Keys
        case 'd' :
        keys.d.pressed = true
        player.lastKey = 'd'
        break
        case 'a' :
        keys.a.pressed = true
        player.lastKey = 'a'
        break
        case 'w' :
        player.velocity.y = -20
        break
        case 'e':
        player.hit()
        break
    }
}

    if (!enemy.dead) {
    
    switch (event.key) {
        // Enemy Keys
        case 'l' :
        keys.l.pressed = true
        enemy.lastKey = 'l'
        break
        case 'j' :
        keys.j.pressed = true
        enemy.lastKey = 'j'
        break
        case 'i' :
        enemy.velocity.y = -20
        break
        case 'u':
        enemy.hit()
        break
    }
}
})

window.addEventListener('keyup', (event) => {
    // Player Keys
    switch (event.key) {
        case 'd' :
        keys.d.pressed = false
        break
        case 'a' :
        keys.a.pressed = false
        break
    }

    // Enemy Keys
    switch (event.key) {
        case 'l' :
        keys.l.pressed = false
        break
        case 'j' :
        keys.j.pressed = false
        break
    }
})
