## Todo

The game itself should be a super-simplified version of Blorp, mainly to avoid implementing trickier platformer details and *especially* to avoid implementing a level editor.


* [x] Add asset loader
* [x] Add spritesheet, animations for player character
* [x] Add bullet firing
* [x] Add enemies, enemy AI
  * [x] Implement Blorp
    * [x] Blorp should change directions when it hits a wall
    * [x] Blorp should get sploded when it's hit by a bullet
* [ ] Add asset loading UI
* [ ] Reimplement collision detection
  * [ ] Player collides with enemies
  * [ ] Bullet collides with enemies (raytracing?)
  * [ ] Physics entities collide with platforms
  * [ ] Can some top-level component be like a CollisionWorld() that automatically collision-pairs all children with Colliders?
    * [ ] Write this out manually before trying to generalize!
* [ ] Implement game rules
  * [x] Player should die when hitting an enemy
    * Use object tags to define what an "enemy" is
    * This is half-implemented but the player still persists in the object graph...
  * [x] Player should die when falling off the world
    * [x] Should also make sure to destroy enemies if they fall off the world
  * [ ] Game states
    * [x] Title Screen
    * [x] Game in progress
    * [x] Game over/dead
* [ ] Add sounds
  * [ ] Pew pew lasergun!
  * [ ] Jump noise

## Resources

* http://gameprogrammingpatterns.com/component.html
* Unity's GameObject and Component classes
  * http://docs.unity3d.com/Manual/GameObjects.html
* https://unity3d.com/learn/tutorials/projects/mini-projects/creating-basic-platformer-game has some interesting platformer-specific samples