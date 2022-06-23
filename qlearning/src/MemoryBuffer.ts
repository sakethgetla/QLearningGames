// import * as tf from '@tensorflow/tfjs';

// import { add } from 'mathjs';


export class MemoryBuffer {
    // data: Array<number[][]>;
    states: number[][];
    // qvals: number[][];
    rewards: number[][];
    nextStates: number[][];
    // index: number;
    stateShape: number;
    qvalShape: number;

    constructor(stateShape: number, qvalShape: number) {
        // this.data = [];
        this.states = [];
        // this.qvals = [];
        this.rewards = [];
        this.nextStates = [];
        //     // this.nextStates = new Array(1000);
        this.stateShape = stateShape;
        this.qvalShape = qvalShape;
        //     this.index = 0;
    }

    addData(state: number[], qval: number[], reward: number, nextState: number[]) {
        // addData(a: number[], b: number[], c: number, d: number[]) {
        // if the model performs no actions then dont store it
        // because in this env it never good to stay still.
        // console.log({ state, qval, reward, nextState });
        // this.index++;
      //
      //

        // if (Math.max(...qval) > 0 && this.data.length < 10000) {
        if (this.states.length < 100000) {
            // console.log(qval, reward, add(qval, reward))
            // console.log(qval, reward, qval.map(q => q + reward))

            // this.data.push([state, qval.map(q => q + reward), nextState])

            // this.state.push(state)
            this.states.push(state);
            // this.qvals.push(qval);
            this.rewards.push(qval.map(q => q * reward));
            // console.log(nextState)
            this.nextStates.push(nextState);
            // // this.nextStates[this.index] = nextState;
            // this.index++;
        // } else if( this.states.length > 1000 ){
        } else {

            this.states.push(state);
            this.rewards.push(qval.map(q => q + reward));
            this.nextStates.push(nextState);

            this.states.shift()
            this.rewards.shift()
            this.nextStates.shift()
        }


    }

    randomIndexs(num: number): number[] {

        // return new Array(num).map(() => Math.floor(Math.random() * this.states.length));
        return Array(num).fill(0).map(() => Math.floor(Math.random() * this.states.length));
    }

    // getBatch(size: number): tf.Tensor[] {
    // getBatch(size: number): Array<number[][]> {
    getBatch(size: number): number[][][] {
        // return [tf.zeros([size, this.stateShape]), tf.zeros([size, this.qvalShape]), tf.zeros([size, this.stateShape])]
        if (this.states.length > 0) {
        // if (false) {

            var indexs = this.randomIndexs(size);
            // var states = tf.tensor(indexs.map(i => this.states[i]));
            // var reward = tf.tensor(indexs.map(i => add(this.qvals[i], this.rewards[i])));
            // var reward = tf.tensor(indexs.map(i => this.qvals[i]));

            // console.log(this.index, this.nextStates.length, this.nextStates, this.states)

            // var nextState: tf.Tensor = tf.tensor(indexs.map(i => {
            //     // console.log(this.index, i);
            //     return this.nextStates[i]
            // }));

            // nextState.print()
            // console.log(nextState.shape)
            // console.assert(nextState !== undefined)

            // var d = indexs.map(i => this.data[i]);
            var a = indexs.map(i => this.states[i]);
            var b = indexs.map(i => this.rewards[i]);
            var c = indexs.map(i => this.nextStates[i]);
            // console.log(indexs, a, b, c)
            return [a, b, c]
        } else {

            // return [tf.zeros([size, this.stateShape]), tf.zeros([size, this.qvalShape]), tf.zeros([size, this.stateShape])]
            var a = [Array(size).fill(Array(this.stateShape).fill(0)), Array(size).fill(Array(this.qvalShape).fill(0)), Array(size).fill(Array(this.stateShape).fill(0))]

            // var a: number[][][] = [Array(size).fill([Array(this.stateShape).fill(0), Array(this.qvalShape).fill(0), Array(this.stateShape).fill(0)])]
            // console.log(a)
            return a;
        }
    }


}
