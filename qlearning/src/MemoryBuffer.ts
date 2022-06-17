import * as tf from '@tensorflow/tfjs';

import { add } from 'mathjs';


export class MemoryBuffer {
    states: number[][];
    qvals: number[][];
    rewards: number[];
    nextStates: number[][];
    index: number;
    stateShape: number;
    qvalShape: number;

    constructor(stateShape: number, qvalShape: number) {
        this.states = [];
        this.qvals = [];
        this.rewards = [];
        this.nextStates = [];
        // this.nextStates = new Array(1000);
        this.stateShape = stateShape;
        this.qvalShape = qvalShape;
        this.index = 0;
    }

    addData(state: number[], qval: number[], reward: number, nextState: number[]) {
        // addData(a: number[], b: number[], c: number, d: number[]) {
        // if the model performs no actions then dont store it
        // because in this env it never good to stay still.
        // console.log(a, b, c, d)
        // this.index++;

        if (Math.max(...qval) > 0 && this.index < 10000) {
            // thisstate.push{}
            this.states.push(state);
            this.qvals.push(qval);
            this.rewards.push(reward);
            console.log(nextState)
            this.nextStates.push(nextState);
            // this.nextStates[this.index] = nextState;
            this.index++;
        }

    }

    randomIndexs(num: number): number[] {

        return new Array(num).map(() => Math.floor(Math.random() * this.index));
    }

    getBatch(size: number): tf.Tensor[] {
        // return [tf.zeros([size, this.stateShape]), tf.zeros([size, this.qvalShape]), tf.zeros([size, this.stateShape])]
        if (this.index > 1) {

            var indexs = this.randomIndexs(size);
            var states = tf.tensor(indexs.map(i => this.states[i]));
            // var reward = tf.tensor(indexs.map(i => add(this.qvals[i], this.rewards[i])));
            var reward = tf.tensor(indexs.map(i => this.qvals[i]));

            console.log(this.index, this.nextStates.length, this.nextStates, this.states)

            var nextState: tf.Tensor = tf.tensor(indexs.map(i => {
                // console.log(this.index, i);
                return this.nextStates[i]
            }));

            // nextState.print()
            // console.log(nextState.shape)
            // console.assert(nextState !== undefined)

            return [states, reward, nextState]
        } else {

            return [tf.zeros([size, this.stateShape]), tf.zeros([size, this.qvalShape]), tf.zeros([size, this.stateShape])]
        }
    }


}
