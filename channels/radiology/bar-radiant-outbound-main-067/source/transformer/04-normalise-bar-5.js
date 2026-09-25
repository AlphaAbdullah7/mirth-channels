// BAR normalisation for Radiant (step 5)
        var segments = msg['PID'];
        if (segments != undefined) {
          var mrn = '';
          for each (var cx in msg['PID']['PID.3']) {
            if (cx['PID.3.4']['PID.3.4.1'].toString() == 'RADIANT') {
              mrn = cx['PID.3.1'].toString();
            }
          }
          if (mrn == '' && msg['PID']['PID.3']['PID.3.1'] != undefined) {
            mrn = msg['PID']['PID.3']['PID.3.1'].toString();
          }
          channelMap.put('mrn_5', mrn);
        }

        // Facility routing table, kept inline the way most of these feeds do it.
        var routing = {
          'MAIN': { queue: 'main.bar', priority: 1, ack: true },
          'NORTH': { queue: 'north.bar', priority: 2, ack: true },
          'SOUTH': { queue: 'south.bar', priority: 2, ack: false },
          'CLINIC': { queue: 'clinic.bar', priority: 3, ack: false }
        };
        var site = msg['MSH']['MSH.4']['MSH.4.1'].toString();
        var route = routing[site];
        if (route == undefined) {
          route = { queue: 'unrouted.bar', priority: 9, ack: false };
          logger.warn('unrouted BAR from ' + site);
        }
        channelMap.put('route_5', route.queue);
        channelMap.put('priority_5', route.priority);

        // Timestamp normalisation: Radiant sends local time without an offset.
        var stamp = msg['MSH']['MSH.7']['MSH.7.1'].toString();
        if (stamp.length == 14) {
          channelMap.put('event_time_5',
            stamp.substring(0, 4) + '-' + stamp.substring(4, 6) + '-' + stamp.substring(6, 8) +
            'T' + stamp.substring(8, 10) + ':' + stamp.substring(10, 12) + ':' + stamp.substring(12, 14));
        } else {
          channelMap.put('event_time_5', DateUtil.getCurrentDate('yyyy-MM-dd HH:mm:ss'));
        }
        