const express = require('express');
const resultCode = require('../utils/resultCode');
const sequelize = require('sequelize');
const util = require('util');
const moment = require('moment');
const { respondJson, respondOnError, respondHtml } = require('../utils/respond');
const _ = require('lodash');
const router = express.Router();
const controllerName = 'Kakao';

// Route Logging
router.use((req, res, next) => {

  console.log(util.format('[Logger]::[Controller]::[%sController]::[Access Ip %s]::[Access Time %s]',
                              controllerName,
                              req.ip,
                              moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
                          ));
  next();
});

// REST Response 참조용
router.post('/', (req, res) => {
  respondJson(res, resultCode.success, {'key' : 'value'});
})

// ORM 참조용
router.get('/:chartNumber', (req, res) => {

  const { chartNumber } = req.params;

  const options = {};
  options.where = { chartNumber: chartNumber }
  options.order = [['id', 'ASC']]

  prescriptionModel
      .find(options)
      .then(result => {

        const prescriptions = result
        options.include = { model: patient }

        chartModel
            .find(options)
            .then(result => {
                result[0].dataValues.prescriptions = prescriptions
                respondJson(res, resultCode.success, result[0]);
            })
      })
      .catch((error) =>{
        respondOnError(res, resultCode.fail, error)
      })
});

module.exports = router;
