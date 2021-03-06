## [-> Audio Autograph <- (Demo)](https://patrickjdarrow.github.io/audio_autograph/)

### Why? Who is John Green?
- John is one of the [Vlogbrothers](https://en.wikipedia.org/wiki/Vlogbrothers), a terrific duo of brothers with takes on social, societal, and global issues.
- He is also an author and signs every copy of his books (100,000s of copies)
- He posted [this video](https://www.youtube.com/watch?v=RN68qKBttgQ&t=1s&ab_channel=vlogbrothers), mentioning that he hadn't yet found a way to autograph digital copies.

### How it works
- An averaging filter is run over the image, calculating the mean pixel intensity for each square in a grid.
- Each square then plays a note corresponding to its height in the image at a time corresponding to it's horizontal position.

![](https://i.gyazo.com/e20bffa819378ac1628e252e1c66286c.gif)
