var _ = require('underscore')
  , utils = require('./utils')

module.exports = Message

function Message(segments) {
  if (!(this instanceof Message))
    return new Message()
  if (segments && Array.isArray(segments)) {
    this.segments = segments
    this.segmentTypes = _.unique(
      _.pluck(this.segments, 'SegmentType')
    )
  } else {
    this.segments = []
    this.segmentTypes = []
  }
}

Message.prototype.addSegment = function(segment) {
  this.segments.push(segment)
  var t = segment.SegmentType
  if (!(~this.segmentTypes.indexOf(t))) {
    this.segmentTypes.push(t)
  }
  if (utils.segmentTypeIsHeader(t)) {
    this.header = segment
  }
}

Message.prototype.getHeader = function() {
  return this.header
}

Message.prototype.getDelims = function() {
  if (!this.header) return {
    segment: '\r',
    field: '|',
    component: '^',
    subcomponent: '&',
    repetition: '~',
    escape: '\\'
  }

  var chars = this.header.EncodingCharacters
  return {
    segment: '\r',
    field: chars[0],
    component: chars[1],
    subcomponent: chars[2],
    repetition: chars[3],
    escape: chars[4]
  }
}