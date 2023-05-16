import { NextApiRequest, NextApiResponse } from "next";

/*
 * You can use path segments through file names instead of a complex routes
 * file when using Serverless Functions on Vercel.
 *
 * By using square brackets ([name].ts),
 * you can retrieve dynamic values from the page segment of the
 * URL inside your Serverless Function.
 *
 * Create a new file inside pages/api called [name].ts and add the following code:
 */

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  const { name } = request.query;
  return response.end(`Hello ${name}!`);
}
