$(document).ready(function () {
  // constants
  var PLAYING = 'playing'
  var PAUSED = 'paused'
  var LOOP_INTERVAL = 1000

  // els
  var $playPause = $('#timeline-slider--play-pause')
  var $playPauseIcon = $playPause.find('.glyphicon')
  var $backward = $('#timeline-slider--backward')
  var $forward = $('#timeline-slider--forward')
  var $sliderEl = $('#timeline-slider')
  var $entryTitle = $('.entry-location')

  // internals
  var maxIdx = $sliderEl.slider('getAttribute', 'max')
  var loopIdx = 0
  var interval

  // start at the beginning
  $sliderEl.slider({ value: loopIdx })

  // handle our events
  $playPause.on('click', handleClick)
  $backward.on('click', decrementIndex)
  $forward.on('click', incrementIndex)
  $sliderEl.on('change', handleSlideEvent)

  function elementsForIndex (idx) {
    return {
      timeline: $('.timeline-map[data-timeline-index=' + idx + ']'),
      entry: $('.paraf-entry[data-timeline-index=' + idx + ']')
    }
  }

  function handleClick () {
    var playing = $(this).data('status') === PLAYING

    if (playing) { togglePause() }
    else { togglePlay() }
  }

  function handleSlideEvent (slideEvt) {
    $('.timeline-map, .paraf-entry').addClass('hidden')
    var idx = slideEvt.value.newValue
    var location = $('.paraf')
    var $els = elementsForIndex(idx)
    $els.timeline.removeClass('hidden')
    $els.entry.removeClass('hidden')

    $entryTitle.text($els.entry.data('title'))

    if (idx !== 0) {
      $backward.attr('disabled', false)
    } else {
      $backward.attr('disabled', true)
    }

    if (idx !== maxIdx) {
      $forward.attr('disabled', false)
    } else {
      $forward.attr('disabled', true)
    }
  }

  function decrementIndex () {
    return setSliderValue(getSliderValue() - 1)
  }

  function incrementIndex () {
    return setSliderValue(getSliderValue() + 1)
  }

  function loop () {
    var nextIdx = incrementIndex()

    if (nextIdx + 1 > maxIdx) { return togglePause() }
  }

  function maybeReset () {
    if (getSliderValue() >= maxIdx) { setSliderValue(0) }
  }

  function getSliderValue () {
    return $sliderEl.slider('getValue')
  }

  // handles setting the value so we don't forget to emit a 'change' event
  function setSliderValue (val) {
    $sliderEl.slider('setValue', val, false, true)
    return val
  }

  // sets the button to pause
  function togglePlay () {
    $playPauseIcon.removeClass('glyphicon-play')
    $playPauseIcon.addClass('glyphicon-pause')
    $playPause.data('status', PLAYING)

    maybeReset()

    interval = setInterval(loop, LOOP_INTERVAL)
  }

  function togglePause () {
    $playPauseIcon.removeClass('glyphicon-pause')
    $playPauseIcon.addClass('glyphicon-play')
    $playPause.data('status', PAUSED)

    clearInterval(interval)
  }
})
