
import type { Component } from 'solid-js';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

const Model: Component = (props) => {
  function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [1], units: 5, useBias: true }));
    model.add(tf.layers.dense({ units: 10, useBias: true, activation: 'sigmoid' }));
    model.add(tf.layers.dense({ units: 1, useBias: true }));

    return model;
  }

  async function trainModel(model, inputs, labels) {
    model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse']
    })

    const batchSize = 32;
    const epochs = 30;

    return await model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: true,
      callbacks: tfvis.show.fitCallbacks(
        {name: 'Training perf'},
        ['loss', 'mse'],
        {height: 200, callbacks: ['onEpochEnd']}
      )
    });
  }

}

export default Model;
