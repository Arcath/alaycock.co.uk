import {TwitterApi} from 'twitter-api-v2'

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER!)

export const getTwitterClient = () => twitterClient.readOnly
