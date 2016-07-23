This is a speculative repo showing what a component-based version of [Pearl](https://github.com/thomasboyt/pearl) could look like. I'm hoping to implement it as a little shim on top of Pearl's `Entity` class before actually implementing it in the engine itself. I'm reimplementing a platformer I made about a year ago, [Blorp](https://github.com/thomasboyt/blorp), with this to see if it's actually feasible.

The Component and GameObject design are inspired heavily by Unity. It remains to be seen whether they'll actually be the right way to implement things.

## Design Questions

* [ ] What is a component responsible for? Standardize and document.
  * Should components be able to *render*? Currently rendering is a separate function defined on the GameObject.
  * https://docs.unity3d.com/Manual/class-SpriteRenderer.html
* [ ] How are "game controller" level components handled?
  * Singleton example in Unity: https://unity3d.com/learn/tutorials/projects/2d-roguelike-tutorial/writing-game-manager
  * Useful SA discussion on Unity singletons starts here: http://forums.somethingawful.com/showthread.php?threadid=2692947&userid=0&perpage=40&pagenumber=444#post462272736
* [x] How should we look up components?
  * Components part of the current object: `self.getComponent(Type)`
* [ ] How should we look up objects?
  * Unity: http://docs.unity3d.com/Manual/ControllingGameObjectsComponents.html
  * Linking directly with setters, like `enemy.setPlayer(player)`
  * By name: http://docs.unity3d.com/ScriptReference/GameObject.Find.html
  * By tag: http://docs.unity3d.com/ScriptReference/GameObject.FindGameObjectsWithTag.html
  * Unity has the concept of a "component tree" that's based around the `Transform` component, so you can e.g. look up "child objects"
* [ ] Begin figuring out what dev tooling around components looks like: how are components visualized?
* [ ] Currently, there are order-dependent update chains. Is this okay? Should this be codified?
  * For example: `PlayerController` has to be applied *before* `PlatformerPhysics`, or things feel really laggy since they're not applied for a whole frame.

## Shim Todo

* [x] Shim `Physical` component into setting center/size on the component so collision checks actually work

## Game Todo

* [ ] Add asset loader
* [ ] Add spritesheet, animations for player character
* [ ] Implement enemies, enemy AI
* [ ] Add sounds

## Resources

* http://gameprogrammingpatterns.com/component.html
* Unity's GameObject and Component classes
  * http://docs.unity3d.com/Manual/GameObjects.html
* https://unity3d.com/learn/tutorials/projects/mini-projects/creating-basic-platformer-game has some interesting platformer-specific samples