import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

export class Model {
  model;
  inputShape;
  constructor( inputShape: number) {
    // inputs: 5
    // wiskers [1 ... numWiskers]
    //
    // outputs: 4
    // arrows , 4
    this.model = tf.sequential();
    this.inputShape = inputShape;
    this.model.add(tf.layers.dense({ inputShape: [inputShape], units: 5, useBias: true }));
    this.model.add(tf.layers.dense({ units: 10, useBias: true, activation: 'sigmoid' }));
    this.model.add(tf.layers.dense({ units: 2, useBias: true }));

    // this.model.compile({
    //   optimizer: tf.train.adam(),
    //   loss: tf.losses.meanSquaredError,
    //   metrics: ['mse']
    // })

    // return model;
  }

  testModel(inputData: Array<Array<number>> ) {
    // console.log(inputData)
    var input = tf.tensor2d(inputData, [inputData.length, this.inputShape ])

    // console.log(input);
    return this.model.predict(input);

  }

  async trainModel(inputs, labels) {
    this.model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse']
    })

    const batchSize = 1;
    const epochs = 1;

    return await this.model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: true,
      // callbacks: tfvis.show.fitCallbacks(
      //   { name: 'Training perf' },
      //   ['loss', 'mse'],
      //   { height: 200, callbacks: ['onEpochEnd'] }
      // )
    });
  }

}

// export default {  Model };
