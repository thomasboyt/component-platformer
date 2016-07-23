This is a speculative repo showing what a component-based version of [Pearl](https://github.com/thomasboyt/pearl) could look like. I'm hoping to implement it as a little shim on top of Pearl's `Entity` class before actually implementing it in the engine itself. I'm reimplementing a platformer I made about a year ago, [Blorp](https://github.com/thomasboyt/blorp), with this to see if it's actually feasible.

The Component and GameObject design are inspired heavily by Unity. It remains to be seen whether they'll actually be the right way to implement things.

## Design Questions

* [ ] What is a component responsible for? Standardize and document.
* [x] How should we look up components?
  * Components part of the current object: `self.getComponent(Type)`
* [ ] How should we look up objects?
  * Unity: http://docs.unity3d.com/Manual/ControllingGameObjectsComponents.html
  * Linking directly with setters, like `enemy.setPlayer(player)`
  * By name: http://docs.unity3d.com/ScriptReference/GameObject.Find.html
  * By tag: http://docs.unity3d.com/ScriptReference/GameObject.FindGameObjectsWithTag.html
  * Unity has the concept of a "component tree" that's based around the `Transform` component, so you can e.g. look up "child objects"
* [ ] Begin figuring out what dev tooling around components looks like: how are components visualized?

## Shim Todo

* [x] Shim `Physical` component into setting center/size on the component so collision checks actually work

## Game Todo

* [ ] everything

## Resources

* http://gameprogrammingpatterns.com/component.html
* Unity's GameObject and Component classes
  * http://docs.unity3d.com/Manual/GameObjects.html
* https://unity3d.com/learn/tutorials/projects/mini-projects/creating-basic-platformer-game has some interesting platformer-specific samples