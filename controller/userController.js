const express = require('express');
const resultCode = require('../common/resultCode');
const sequelize = require('sequelize');
const { respondJson, respondOnError, respondHtml } = require('../utils/respond');
const _ = require('lodash');
const router = express.Router();

router.use(function log(req, res, next) {

  console.log('## [Prescription] PrescriptionController started ##');
  next();
});

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

router.get('/medicine/:prescriptionId', (req, res) => {

  const { prescriptionId } = req.params;

  const options = {};
  options.where = { id: prescriptionId }
  options.order = [['id', 'ASC']]

  prescriptionModel
      .findOne(options)
      .then(result => {
        respondJson(res, resultCode.success, result);
      })
      .catch((error) =>{
        respondOnError(res, resultCode.fail, error)
      })
});

router.post('/update', (req, res) => {

  const { prescriptionId } = req.body;
  delete req.body.prescriptionId;
  const data = req.body;
  data.useTotal = data.doses * statusConvert(data.dosesCountByDay) * data.dosesDay

  const options = {};
  options.update = data
  options.where = { id: prescriptionId }

  prescriptionModel
      .update(options)
      .then(result => {
        respondJson(res, resultCode.success, result);
      })
      .catch((error) =>{
        respondOnError(res, resultCode.fail, error)
      })
});

router.post('/delete', (req, res) => {

  const { prescriptionId } = req.body;

  const options = {};
  options.where = { id: prescriptionId }

  prescriptionModel
      .delete(options)
      .then(result => {
        respondJson(res, resultCode.success, result);
      })
      .catch((error) =>{
        respondOnError(res, resultCode.fail, error)
      })
});

router.post('/create', (req, res) => {

  const data = req.body;
  if (!data.useTotal) data.useTotal = data.doses * statusConvert(data.dosesCountByDay) * data.dosesDay

  prescriptionModel
      .create(data)
      .then(result => {
        respondJson(res, resultCode.success, result);
      })
      .catch((error) =>{
        respondOnError(res, resultCode.fail, error)
      })
});

router.get('/history/:startTime/:endTime/:category', (req, res)=>{

  var { category, startTime, endTime } = req.params
  const { word } = req.query
  startTime += ' 00:00:00'
  endTime += ' 23:59:59'

  const options = {}
  options.include = { model: medicine, attributes: ['primaryCategory', 'secondaryCategory', 'totalAmount', 'quantity'] }
  options.where = { useFlag: '1', createdAt: {between: [startTime, endTime]} }
  options.attributes = ['medicineName', 'medicineIngredient', [sequelize.fn('SUM', sequelize.col('prescription.useTotal')), 'total'], 'createdAt']
  options.group = ['prescription.medicine_id']

  if (word.length > 0) {
    (category === '1') ? options.where.medicineName = { like: `%` + word + `%` } : options.where.medicineIngredient = { like: `%` + word + `%` }
  }

  prescriptionModel
    .history(options)
    .then(result => {
      respondJson(res, resultCode.success, result)
    })
    .catch(error => {
      console.log(error)
      respondOnError(res, resultCode.fail, error)
    })
});


/**
 * @function statusConvert
 * @param  {string} param 1일 복용횟수
 * @return {Number} 복용 횟수 숫자 치환 값
 * @description 근데 이거 chartModel에도 쓰임, 이런 함수가 종종 있는데 나중에 공통 모듈로 묶어서 빼거나 해야할 것으로 예상
 */

function statusConvert (param) {
  switch (param) {
    case 'qd' : return 1; break;
    case 'bid' : return 2; break;
    case 'tid' : return 3; break;
    case 'hs' : return 4; break;
  }
}

module.exports = router;
