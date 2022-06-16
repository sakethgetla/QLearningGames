import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

export class Model {
  model;
  target;
  inputShape;
  outputShape;
  // trainingData;
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
    this.trainingDataInputs = tf.zeros([10000, inputShape]);
    this.trainingDataOutputs = tf.zeros([10000, outputShape]);
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
  storeData(prediction: tf.Tensor, action: tf.Tensor, reward: number, newState: tf.Tensor) {
    // this.trainingDataInputs[this.index].map((pred: , i: number) => prediction[i])
    // this.trainingDataInputs[this.index] = prediction.reshape([-1]);
    // prediction.print()
    // this.trainingDataInputs.push(prediction.dataSync());
    this.trainingDataInputs[this.index].add(prediction);

    // var input = tf.tensor2d(newState, [newState.length, this.inputShape])
    // newState.print()
    var targetOutput = this.model.predict(newState).reshape([-1]);
    // var targetOutput = this.target.predict(newState).reshape([-1]);
    // targetOutput.print()
    // var targetOutput = this.target.predict(input);

    // if (reward) {
    //   targetOutput.print()
    //   prediction.print()
    //   prediction.mul(reward).print()
    //   targetOutput = targetOutput.add(prediction.mul(reward))
    //   targetOutput.print()
    // }

    // this.trainingDataOutputs.push(targetOutput.add(action.mul(reward)).dataSync());

    this.index++;

    if (this.index > 10000) {
      this.trainingDataInputs.shift();
      this.trainingDataOutputs.shift();
    }

    // console.log(await this.trainModel());
    // this.trainModel()
    //
  }

  // async trainModel() {
  trainModel() {
    this.model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse']
    })

    // console.log('training')

    // for

    // this.model.fit(this.trainingDataInputs, this.trainingDataOutputs, {
    // this.model.fit(tf.tensor2d(this.trainingDataInputs, [this.trainingDataInputs.length, this.inputShape]), tf.tensor2d(this.trainingDataOutputs, [this.trainingDataOutputs.length, this.outputShape]), {

    // let a = tf.tensor2d(this.trainingDataInputs, [this.trainingDataInputs.length, this.inputShape])
    // a.print()
    // console.log(this.trainingDataInputs.length, this.inputShape);
    // console.log(this.trainingDataInputs.length );
    // console.log(this.trainingDataInputs[0].length );
    // console.log(tf.tensor( this.trainingDataInputs ).shape);
    // this.trainingDataInputs[0].print();
    // console.log(this.trainingDataInputs);

    // let a =
    // tf.tensor(this.trainingDataInputs).print()
    // tf.tensor2d(this.trainingDataInputs, [this.trainingDataInputs.length, this.inputShape]).print()

    // console.log(tf.tensor2d(this.trainingDataInputs, [this.trainingDataInputs.length, this.inputShape]), tf.tensor2d(this.trainingDataOutputs, [this.trainingDataOutputs.length, this.outputShape]))


    // this.model.fit(tf.tensor2d(this.trainingDataInputs, [this.trainingDataInputs.length, this.inputShape]), tf.tensor2d(this.trainingDataOutputs, [this.trainingDataOutputs.length, this.outputShape]), {
    // this.model.getWeights()[0].print()
    // console.log(this.model.getWeights()[0]);

    // this.model.fit(tf.tensor(this.trainingDataInputs), tf.tensor(this.trainingDataOutputs), {

    return this.model.fit(tf.tensor2d(this.trainingDataInputs, [this.trainingDataInputs.length, this.inputShape]), tf.tensor2d(this.trainingDataOutputs, [this.trainingDataOutputs.length, this.outputShape]), {
      batchSize: 1,
      epochs: 1,
      shuffle: true
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
    m.add(tf.layers.dense({ inputShape: [inputShape], units: 8, useBias: true }));
    m.add(tf.layers.dense({ units: 6, useBias: true, activation: 'relu' }));
    m.add(tf.layers.dense({ units: outputShape, useBias: true }));
    return m
  }


  // async trainModel(inputs: [], labels: []) {
  //   this.model.compile({
  //     optimizer: tf.train.adam(),
  //     loss: tf.losses.meanSquaredError,
  //     metrics: ['mse']
  //   })

  //   const batchSize = 1;
  //   const epochs = 1;

  //   return await this.model.fit(inputs, labels, {
  //     batchSize,
  //     epochs,
  //     shuffle: true,
  //     // callbacks: tfvis.show.fitCallbacks(
  //     //   { name: 'Training perf' },
  //     //   ['loss', 'mse'],
  //     //   { height: 200, callbacks: ['onEpochEnd'] }
  //     // )
  //   });
  // }

}

// export default {  Model };
