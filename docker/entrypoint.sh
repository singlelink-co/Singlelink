#!/bin/bash
npm i
npm run build
npm run db:migrate
npm run start