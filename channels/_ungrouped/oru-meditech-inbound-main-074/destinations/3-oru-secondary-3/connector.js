// ORU → oru_sink_3
      var payload = {
        messageId: String(connectorMessage.getMessageId()),
        channel: String(channelName),
        feed: 'ORU',
        target: 'oru_sink_3',
        mrn: String(channelMap.get('mrn_1')),
        route: String(channelMap.get('route_1')),
        received: String(channelMap.get('event_time_1'))
      };

      // Real feeds do a little work here before handing off; kept so the definition is
      // representative in size as well as in shape.
      var required = ['messageId', 'channel', 'feed', 'mrn'];
      for (var i = 0; i < required.length; i++) {
        if (payload[required[i]] == 'null' || payload[required[i]] == '') {
          logger.debug('missing ' + required[i] + ' on ' + payload.messageId);
        }
      }

      channelMap.put('oru_sink_3_payload_bytes', JSON.stringify(payload).length);
      return;
      