'use strict';

var inputNumber, inputRadix, inputDigitSet, ignoreCase,
	outputField, outputRadix, outputDigitSet, error;

window.onload = function() {
	outputField = document.getElementById('outputField');
	clearError();
	['inputNumber', 'inputRadix', 'inputDigitSet', 'ignoreCase',
		'outputRadix', 'outputDigitSet'].forEach(function(id) {
			window[id] = document.getElementById(id);
			window[id].oninput = update;
		})
}

function update() {
	clearError();
	validateDigitSet('input');
	validateDigitSet('output');
	if (!error) {
		var result = calculate();
		if (!error)
			outputField.value = result;
	}
}

function calculate() {
	return numtostr(
		strtonum(
			inputNumber.value,
			inputRadix.valueAsNumber,
			inputDigitSet.value),
		outputRadix.valueAsNumber,
		outputDigitSet.value);
}

function strtonum(input, radix, digitset) {
	if (ignoreCase.checked) {
		input = input.toUpperCase();
		digitset = digitset.toUpperCase();
	}
	var result = 0, placeMultiplier = 1;
	for (var i = input.length-1; i !== -1; i--) {
		var n = digitset.indexOf(input[i]);
		if (n === -1)
			return setError("‘" + input[i] +
				"’ is not a recognized digit");
		result += n * placeMultiplier;
		placeMultiplier *= radix;
	}
	return result
}

function numtostr(input, radix, digitset) {
	if (input === null)
		return;
	var result = "";
	do {
		result = digitset[input - Math.floor(input/radix) * radix] +
			result;
		input = Math.floor(input/radix);
	} while (input);
	return result;
}

function validateDigitSet(type) {
	var digitset = window[type + 'DigitSet'].value,
		radix = window[type + 'Radix'].valueAsNumber
	if (ignoreCase.checked)
		digitset = digitset.toUpperCase();
	if (digitset.length !== radix)
		return setError(type + " digit set contains " +
			digitset.length + " digits — too " +
			(digitset.length < radix ? "few" : "many") +
			" for radix " + radix);
	for (var i = 0, l = digitset.length; i !== l; i++)
		if (digitset.lastIndexOf(digitset[i]) !== i)
			return setError("‘" + digitset[i] +
				"’ occurs multiple times in " + type +
				" digit set");
}

function setError(message) {
	outputField.classList.remove('Valid');
	outputField.value = "ERROR: " + String(message);
	error = true;
	return null;
}

function clearError() {
	outputField.value = "";
	outputField.classList.add('Valid');
	error = false;
}
