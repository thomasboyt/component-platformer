# Let's Build a Platformer with TypeScript and Pearl!

Pearl is a game framework for 2D games written in TypeScript. It was born out of some of the complications I ran into while making games with [Coquette](http://coquette.maryrosecook.com/). It contains a number of helpful utilities for making games on the web, including a small audio player, an asset preloader, a sprite sheet parser, and an animation manager. It also includes the core of Coquette, which has collision detection and simplified canvas rendering built-in.

Unlike Coquette, Pearl uses a [component](http://gameprogrammingpatterns.com/component.html)-based architecture to avoid objects that are heavily-coupled and rely on fragile, complicated inheritance chains. If you've used Unity, you should be very at home with this system, but if not, it's not very difficult to use.

## Scaffolding

You'll want to start by downloading the [Pearl Boilerplate](https://github.com/thomasboyt/pearl-boilerplate), which includes the basic build setup you'll need to run and ship your game. Once you have it unzipped, in a folder, just run:

```
npm install
npm run dev
```

And a server should come up.
