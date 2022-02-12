import { inputs } from './inputs'
import { mutations } from './mutations'
import { queries } from './queries'
import { scalars } from './scalars'
import { types } from './types'

import {gql} from 'apollo-server-micro'

export const typeDefs = [
    queries,
    /*inputs, */
    mutations,
    /*scalars,*/
    types,
]