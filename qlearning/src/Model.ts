import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

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
    this.epsilon = 0.1;
    this.outputShape = outputShape;

    // this.target = this.model.clone_model();

    this.model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse']
    })

    // return model;
  }

  // async storeData(prediction: tf.Tensor, action: tf.Tensor, reward: number, newState: tf.Tensor) {
  storeData(oldState: tf.Tensor, action: tf.Tensor, reward: number, newState: tf.Tensor) {
    // this.trainingDataInputs[this.index].add(prediction); // var input = tf.tensor2d(newState, [newState.length, this.inputShape])

    if (this.index < 10000){

    this.trainingDataInputs = this.trainingDataInputs.concat(oldState);

    // oldState.print()
    // newState.print()
    var targetOutput = this.model.predict(newState);

    this.trainingDataOutputs = this.trainingDataOutputs.concat(targetOutput.add(action.mul(reward)))
    } else {
      console.log('10,000')
    }

    // this.trainingDataInputs.print();
    // this.trainingDataOutputs.print();

    // console.log(this.trainingDataInputs);
    // this.trainingDataInputs[0].print();
    // this.trainingDataOutputs[this.index].print();
    this.index++;

    if (this.index > 10000) {
      // this.trainingDataInputs.shift();
      // this.trainingDataOutputs.shift();
    }

    // console.log(await this.trainModel());
    this.trainModel()
    //
  }

  // async trainModel() {
  trainModel() {
    this.model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse']
    })


    // return this.model.fit(tf.tensor2d(this.trainingDataInputs, [this.trainingDataInputs.length, this.inputShape]), tf.tensor2d(this.trainingDataOutputs, [this.trainingDataOutputs.length, this.outputShape]), {
    return this.model.fit(this.trainingDataInputs, this.trainingDataOutputs, {
      batchSize: 1,
      epochs: 1,
      shuffle: false
    })

    // console.log('trained')
  }

  getQval(inputData: Array<Array<number>>) {
    // console.log(inputData)
    var input = tf.tensor2d(inputData, [inputData.length, this.inputShape])
    // input.print()

    // console.log(input);
    if (Math.random() > this.epsilon) {
      return this.model.predict(input);
    } else {
      let a = Array(this.outputShape).fill(0);
      a[Math.floor(Math.random() * this.outputShape)] = 1
      return tf.tensor(a);
    }

  }

  // customLoss(yTrue, yPred){

  // }


  createModel(inputShape: number, outputShape: number) {
    var m
    m = tf.sequential();
    m.add(tf.layers.dense({ inputShape: [inputShape], units: 8, activation: 'relu', useBias: true }));
    m.add(tf.layers.dense({ units: 6, useBias: true, activation: 'relu' }));
    m.add(tf.layers.dense({ units: outputShape, useBias: true, activation: 'relu'}));
    return m
  }


}

// export default {  Model };
