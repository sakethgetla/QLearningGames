import { zeros, Tensor, tensor, train, losses, sequential, layers, tensor2d, tidy } from '@tensorflow/tfjs';
// import {zeros, Tensor} from '@tensorflow/tfjs';
// import * as tfvis from '@tensorflow/tfjs-vis';
import { MemoryBuffer } from './MemoryBuffer';
// import { transpose } from 'mathjs';

// const tf = {zeros, Tensor, tensor, train, losses, sequential, layers, tensor2d, tidy};

export class Model {
  model;
  target;
  inputShape;
  outputShape;
  // trainingData;
  // trainingDataInputs: Tensor[]
  // trainingDataOutputs: Tensor[]
  trainingDataInputs: Tensor;
  trainingDataOutputs: Tensor;
  index;
  epsilon;
  oldState: Tensor;
  discountFactor: number;
  // p: String;
  memoryBuffer: MemoryBuffer;
  constructor(inputShape: number, outputShape: number) {
    // inputs: 5
    // wiskers [1 ... numWiskers]
    //
    // outputs: 4
    // arrows , 4
    this.inputShape = inputShape;
    this.model = this.createModel(inputShape, outputShape)
    this.target = this.createModel(inputShape, outputShape)
    this.trainingDataInputs = zeros([1, inputShape])
    this.trainingDataOutputs = zeros([1, outputShape])
    this.index = 0;
    this.epsilon = 100;
    this.outputShape = outputShape;
    // this.p = 'finished';
    this.oldState = zeros([1, inputShape]);
    this.memoryBuffer = new MemoryBuffer(inputShape, outputShape);
    this.discountFactor = 0.9;

    // this.target = this.model.clone_model();

    this.model.compile({
      optimizer: train.adam(),
      loss: losses.meanSquaredError,
      // metrics: ['mse']
    })

    // this.trainModel()

    // return model;
  }

  // async storeData(prediction: Tensor, action: Tensor, reward: number, newState: Tensor) {
  storeData(state: number[], qvals: number[], reward: number, nextState: number[]) {

    this.memoryBuffer.addData(state, qvals, reward, nextState);
    if (this.memoryBuffer.states.length === 200) {

      this.trainModel()
        console.log('training');
    }
  }

  // async trainModel() {
  trainModel() {


    // return this.model.fit(tensor2d(this.trainingDataInputs, [this.trainingDataInputs.length, this.inputShape]), tensor2d(this.trainingDataOutputs, [this.trainingDataOutputs.length, this.outputShape]), {

    // if (this.memoryBuffer.states.length > 100) {
    if (true) {

      var [x, r, x1] = this.memoryBuffer.getBatch(100);
      // var [ data ] = this.memoryBuffer.getBatch(5);
      // console.log(x, x1)
      // console.log(r)
      // tensor(data).print()

      // console.log(transpose( data ))


      // var xt = tensor(x)
      // xt.print()
      var xt = tidy(() => tensor(x))

      var x1t = tidy(() => tensor(x1))
      // x1t.print()
      var y = tidy(() => this.target.predict(x1t))

      var label = tidy(()=> tensor(r).add(y.mul(this.discountFactor)));
      // console.log(xt, label)
      // xt.print()
      // label.print()

      // this.model.fit(xt, y.add(tensor(r)).mul(0.5) ).then((loss) => {
      this.model.fit(xt, label).then((loss) => {
        // console.log('trained', loss.history.loss);
        this.target.setWeights(this.model.getWeights());
        this.trainModel();
      })
    }

  }

  getQval(inputData: Array<Array<number>>): number[] {
    // console.log(inputData)
    var input = tensor2d(inputData, [inputData.length, this.inputShape])
    // input.print()

    // console.log(input);

    // var output: (Float32Array | Uint8Array);
    var output: number[];
    var qvals: Tensor;
    // if (Math.random() > this.epsilon) {
    if (Math.random() > this.epsilon/(this.memoryBuffer.states.length + this.epsilon)) {
      qvals = tidy(() => this.model.predict(input));
      output = qvals.dataSync();
    } else {
      let a = Array(this.outputShape).fill(0).map(() => Math.random() - 0.5);
      // a[Math.floor((Math.random()-0.5) * this.outputShape)] = 1
      qvals = tensor([a]);
      output = a;
    }

    return output;

  }

  // customLoss(yTrue, yPred){

  // }


  createModel(inputShape: number, outputShape: number) {
    var m
    m = sequential();
    m.add(layers.dense({ inputShape: [inputShape], units: 8, activation: 'tanh', useBias: true }));
    m.add(layers.dense({ units: 6, useBias: true, activation: 'tanh' }));
    m.add(layers.dense({ units: outputShape, useBias: true, activation: 'tanh' }));
    return m
  }


}

// export default {  Model };
