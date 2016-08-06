## Todo

The game itself should be a super-simplified version of Blorp, mainly to avoid implementing trickier platformer details and *especially* to avoid implementing a level editor.

* [x] Add asset loader
* [x] Add spritesheet, animations for player character
* [x] Add bullet firing
* [x] Add enemies, enemy AI
  * [x] Implement Blorp
    * [x] Blorp should change directions when it hits a wall
    * [x] Blorp should get sploded when it's hit by a bullet
* [x] Add sounds
  * [x] Pew pew lasergun!
  * [x] Jump noise
* [x] Implement game rules
  * [x] Player should die when hitting an enemy
    * Use object tags to define what an "enemy" is
    * This is half-implemented but the player still persists in the object graph...
  * [x] Player should die when falling off the world
    * [x] Should also make sure to destroy enemies if they fall off the world
  * [x] Game states
    * [x] Title Screen
    * [x] Game in progress
    * [x] Game over/dead
* [ ] Reimplement collision detection
  * [x] Physics entities collide with platforms
  * [x] Player collides with enemies
  * [x] Bullet collides with enemies (raytracing?)
  * [ ] Can some top-level component be like a CollisionWorld() that automatically collision-pairs all children with Colliders?
    * [ ] Write this out manually before trying to generalize!
* [ ] Add asset loading UI