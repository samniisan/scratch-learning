<template>
  <v-app id="app">
    <img src="./assets/kuzzle.png" height="60">
    <v-stepper v-if="steps.length > 0" v-model="currentStep" vertical>
      <template v-for="step in steps">
        <v-stepper-step :key="step.index" :step="step.index" :complete="currentStep > step.index">{{ step.title }}<small>{{ step.subtitle }}</small></v-stepper-step>
        <v-stepper-content :step="step.index">
          <v-card v-if="step.description" class="subheading grey lighten-4 pa-3">
            <div v-html="step.description"></div>
          </v-card>
          <v-card v-if="showHint && step.hint" class="subheading amber accent-4 pa-3">
            <transition name="slide-fade" mode="out-in" appear>
              <div v-html="step.hint"></div>
            </transition>
          </v-card>
          <v-card class="blue-grey lighten-4" height="200px">
            <v-layout>
              <v-flex sm10 offset-sm1>
                <v-text-field
                  style="font-family: monospace"
                  textarea
                  :label="step.inputLabel"
                  v-model="code"
                  multi-line
                  :disabled="disabled">
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-card>
          <v-card class="teal lighten-4 mb-2 pa-3">
            <span class="subheading" style="font-family: monospace">Result output:</span>
            <transition name="slide-fade" mode="out-in" appear>
              <div ref="resultBox"></div>
            </transition>
          </v-card>
          <v-btn success @click.native="stepUp" :loading="loading">{{ stepText }}</v-btn>
          <transition name="slide-fade" mode="out-in" appear>
            <v-btn info v-if="canProceed" @click.native="submitStep">Run my code again</v-btn>
          </transition>
          <transition name="slide-fade" mode="out-in" appear>
            <v-btn warning v-if="!showHint" @click.native="showHint = true">Some hint?</v-btn>
          </transition>
          <transition name="slide-fade" mode="out-in" appear>
            <v-btn v-if="!canProceed" @click.native="giveUp" error>I give up..</v-btn>
          </transition>
        </v-stepper-content>
      </template>
    </v-stepper>x
    <v-snackbar
      :timeout=6000
      :success="snackbarLevel === 'success'"
      :error="snackbarLevel === 'error'"
      v-model="snackbar">
      {{ snackbarText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      steps: [],
      currentStep: 0,
      currentSubStep: 0,
      sessionId: '',
      code: '',
      loading: false,
      proceed: false,
      snackbar: false,
      snackbarLevel: '',
      snackbarText: '',
      showHint: false,
      result: '',
      showResultBox: false,
      formatter: null,
      disabled: false,
      kuzzleTimestamp: 0
    }
  },
  mounted () {
    this.sessionId = (+new Date).toString(36);
    this.initSteps();
    this.initSubscribe(this.sessionId);
  },
  computed: {
    canProceed: function () { return this.proceed },
    stepText: function () { return this.proceed ? 'Next step' : 'Run my code!' }
  },
  methods: {
    stepUp () {
      if (!this.proceed) {
        this.submitStep();
      } else {
        this.nextStep();
      }
    },
    giveUp () {
      this.steps[this.currentStep - 1].inputLabel = "Here's the solution:";
      this.code = this.steps[this.currentStep - 1].solution;
      this.proceed = true;
      this.showSnackbar('Was it too difficult? Got lost? :( Let us know!', 'warning');
    },
    submitStep () {
      this.loading = true;
      this.setVolatile();
      let nowChecking = this.currentStep;
      setTimeout(function () {
        if (!this.proceed && (nowChecking === this.currentStep)) {
          this.loading = false;
          this.showSnackbar('Looks like you failed this exercise..', 'error');
        }
      }.bind(this), 2000);
      try {
        eval(this.code);
      } catch (e) {}
    },
    nextStep () {
      ++this.currentStep;
      this.currentSubStep = this.steps[this.currentStep - 1].multipleCalls ? 1 : 0;
      setTimeout(function () {
        this.proceed = false;
        this.code = this.steps[this.currentStep - 1].inputValue;
        this.showHint = false;
        this.result = '';
        this.showResultBox = false;
        this.disabled = false;
      }.bind(this), 300);
    },
    initSteps () {
      let stepsCallback = function () {
        let self = this;

        kuzzle.now(function (err, res) {
          self.kuzzleTimestamp = res || new Date().getTime();

          kuzzle.collection('learning', 'foo').search({sort: [{index: 'asc'}]}, function (err, res) {
            if (err) {
              console.log('Search KO!');
            } else {
              self.steps = res.documents.map(function (s) {
                return Object.assign(s.content, {description: TJ(s.content.description), hint: TJ(s.content.hint)});
              });
              self.code = self.steps[0].inputValue;
              self.currentStep = 1;
            }
          });
        });
      }.bind(this);

      setTimeout(stepsCallback, 500);
    },
    initSubscribe () {
      let learningCallback = function () {
        let self = this;

        kuzzle.collection('learning', 'foo').subscribe({ equals: { sessionId: this.sessionId } }, function (err, res) {
          console.log(err);
          console.log(res);
          self.loading = false;
          if (err) {
            console.log('Subscribe KO!');
          } else {
            if (res.document.content.stepResult === "ok") {
              console.log('PASS!');
              self.disabled = true;
              if (!self.proceed) {
                self.proceed = true;
                self.showSnackbar('Awesome! You\'re learning fast :)', 'success');
              }
              self.showOutput(res);
            } else if (res.document.content.stepResult === "partial") {
              ++self.currentSubStep;
              self.setVolatile();
            } else {
              self.currentSubStep = self.steps[self.currentStep - 1].multipleCalls ? 1 : 0;
              console.log('YOU SHALL NOT PASS!');
            }
          }
        })
      }.bind(this);

      setTimeout(learningCallback, 1000);
    },
    setVolatile () {
      kuzzle.volatile = {
        sessionId: this.sessionId,
        step: this.currentStep,
        subStep: this.currentSubStep,
        indexTimestamp: this.kuzzleTimestamp
      };
    },
    showOutput (res) {
      this.formatter = new JF(res.document.content.stepResponse.content, 1, { hoverPreviewEnabled: true });
      this.$refs.resultBox[this.currentStep - 1].innerHTML = '';
      this.$refs.resultBox[this.currentStep - 1].appendChild(this.formatter.render());
      this.showResultBox = true;
    },
    showSnackbar (message, level) {
      this.snackbarLevel = level;
      this.snackbarText = message;
      this.snackbar = true;
    }
  }
}
</script>

<style scoped>
  .slide-fade-enter-active {
    transition: all .2s ease;
  }
  .slide-fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for <2.1.8 */ {
    transform: translateX(100px);
    opacity: 0;
  }
</style>
