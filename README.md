# Chess Clock

This is a chess clock that I made because I like playing board games and a lot of my friends think quite slowly, and I'm
a little impatient.

It's "serverless", as it uses WebRTC to make a datachannel between the clients without need for communication with a
backend. It does use Firebase for signalling and public stun servers, but other than those, everything is P2P.

### Future Features

- fix css (UX fixes, links to buttons, fullscreen, keyboard capture)
- mobile responsive
- reconnect to session/room
- \>2 players