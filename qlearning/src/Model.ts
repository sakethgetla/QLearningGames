import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { MemoryBuffer } from './MemoryBuffer';
import { transpose } from 'mathjs';

export class Model {
  model;
  target;
  inputShape;
  outputShape;
  // trainingData;
  // trainingDataInputs: tf.Tensor[]
  // trainingDataOutputs: tf.Tensor[]
  trainingDataInputs: tf.Tensor;
  trainingDataOutputs: tf.Tensor;
  index;
  epsilon;
  oldState: tf.Tensor;
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
    this.trainingDataInputs = tf.zeros([1, inputShape])
    this.trainingDataOutputs = tf.zeros([1, outputShape])
    this.index = 0;
    this.epsilon = 0.05;
    this.outputShape = outputShape;
    // this.p = 'finished';
    this.oldState = tf.zeros([1, inputShape]);
    this.memoryBuffer = new MemoryBuffer(inputShape, outputShape);

    // this.target = this.model.clone_model();

    this.model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      // metrics: ['mse']
    })

    this.trainModel()
    // return model;
  }

  // async storeData(prediction: tf.Tensor, action: tf.Tensor, reward: number, newState: tf.Tensor) {
  storeData(state: number[], qvals: number[], reward: number, nextState: number[]) {

    this.memoryBuffer.addData(state, qvals, reward, nextState);
  }

  // async trainModel() {
  trainModel() {


    // return this.model.fit(tf.tensor2d(this.trainingDataInputs, [this.trainingDataInputs.length, this.inputShape]), tf.tensor2d(this.trainingDataOutputs, [this.trainingDataOutputs.length, this.outputShape]), {

    var [x, r, x1] = this.memoryBuffer.getBatch(5);
    // var [ data ] = this.memoryBuffer.getBatch(5);
    // console.log(x, x1)
    // console.log(data)
    // tf.tensor(data).print()

    // console.log(transpose( data ))


    var xt = tf.tensor(x)
    // xt.print()
    var x1t = tf.tensor(x1)
    // x1t.print()
    var y = this.target.predict(x1t)

    // // console.log(x.shape, y.shape)

    this.model.fit(xt, y.add(tf.tensor( r ))).then((loss) => {
      console.log('trained', loss.history.loss);
      this.trainModel();
    })
  }

  getQval(inputData: Array<Array<number>>): number[] {
    // console.log(inputData)
    var input = tf.tensor2d(inputData, [inputData.length, this.inputShape])
    // input.print()

    // console.log(input);

    // var output: (Float32Array | Uint8Array);
    var output: number[];
    var qvals: tf.Tensor;
    if (Math.random() > this.epsilon) {
      qvals = tf.tidy(() => this.model.predict(input));
      output = qvals.dataSync();
    } else {
      let a = Array(this.outputShape).fill(0).map(()=> Math.random()-0.5);
      // a[Math.floor((Math.random()-0.5) * this.outputShape)] = 1
      qvals = tf.tensor([a]);
      output = a;
    }

    return output;

  }

  // customLoss(yTrue, yPred){

  // }


  createModel(inputShape: number, outputShape: number) {
    var m
    m = tf.sequential();
    m.add(tf.layers.dense({ inputShape: [inputShape], units: 8, activation: 'relu', useBias: true }));
    // m.add(tf.layers.dense({ units: 6, useBias: true, activation: 'relu' }));
    m.add(tf.layers.dense({ units: outputShape, useBias: true, activation: 'relu' }));
    return m
  }


}

// export default {  Model };
