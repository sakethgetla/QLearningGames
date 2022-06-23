# QLearningGames

-build-

TODO 
 - [x] dont store useless data. eg when the output of the model is all 0. no action taken.
 - [x] make input data more valuable by giving the distances to detected food.
 - [x] make traing more efficent, only convert current batch to tensors.
 - [x] change memory reply, store: (state, reward, next_state), compute batch.
 - [x] change output shape to 2 rather than 4.
 - [x] update target model weights.
 - [x] change activation function to tanh so the outputs can be negative aswell.
 - [x] tidy up tensors that are not being used.
 - [x] make the memory buffer not store more than 10 000 samples.
 - [ ] show a graph of loss.
 - [ ] add discount factor.
 
 Exps to make the model learn better.
 - [ ] add dropout to model.
 - [x] add current location to input.
 - [x] negative reward for going far from the centre of the screen? to stop from getting stuck in the corner.
 - [ ] after set time the model relocates to a random position. decrease the amount of time stuck in corner
 - [ ] pre-train the model with tf-core on backend. then deploy to fronend.
 - [ ] 




*Thougths*

atfer a while the model get stuck in a corner and doesnt do anything. i have to find a way to make it be more random.
