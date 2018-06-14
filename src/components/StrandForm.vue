<template>
  <v-container style="margin: 0">
  <v-layout row wrap>
  <v-flex xs12>
    <v-card>
      <v-card-text style="padding-top: 0">

        <v-card-title class="headline" primary-title>Strand Form</v-card-title>

        <v-form>
          <v-container fluid grid-list-xl>
            <v-layout row wrap>
              <TextInput label="Name" v-model="name" xs12></TextInput>
              <DynamicField :items="sub">
                <!--suppress HtmlUnknownAttribute -->
                <template slot-scope="{ item, index, lastIndex, clickedIcon }">
                  <SelectInput xs3 :items="['Subsection', 'Benchmark']" label="Type" v-model="item.type" style="padding-left: 0"></SelectInput>
                  <TextInput
                    xs9
                    label="Name"
                    v-model="item.name"
                    :append-icon="lastIndex ? 'add' : 'close'"
                    :append-icon-cb="clickedIcon('sub', index, 'strand')"
                  ></TextInput>
                </template>
              </DynamicField>
            </v-layout>
          </v-container>
        </v-form>

      </v-card-text>

      <v-divider class="mt-5"></v-divider>
      <v-card-actions>
        <v-btn flat>Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="submit">Submit</v-btn>
      </v-card-actions>

    </v-card>
  </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
  import TextInput from '@/components/inputs/TextInput'
  import DynamicField from '@/components/inputs/DynamicField'
  import SelectInput from '@/components/inputs/SelectInput'
  import { mapFields, mapMultiRowFields } from 'vuex-map-fields'

  export default {
    name: 'StrandForm',
    components: { SelectInput, DynamicField, TextInput },
    computed: {
      ...mapFields(['strand.name']),
      ...mapMultiRowFields(['strand.sub'])
    },
    methods: {
      submit () {
        this.$store.dispatch('addStrand').then(() => {
        }).catch(err => {
          console.error(err)
        })
      }
    }
  }
</script>

<style scoped>

</style>
