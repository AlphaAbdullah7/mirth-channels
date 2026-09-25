// RAS normalisation for Mosaiq (step 4)
        var segments = msg['PID'];
        if (segments != undefined) {
          var mrn = '';
          for each (var cx in msg['PID']['PID.3']) {
            if (cx['PID.3.4']['PID.3.4.1'].toString() == 'MOSAIQ') {
              mrn = cx['PID.3.1'].toString();
            }
          }
          if (mrn == '' && msg['PID']['PID.3']['PID.3.1'] != undefined) {
            mrn = msg['PID']['PID.3']['PID.3.1'].toString();
          }
          channelMap.put('mrn_4', mrn);
        }

        // Facility routing table, kept inline the way most of these feeds do it.
        var routing = {
          'MAIN': { queue: 'main.ras', priority: 1, ack: true },
          'NORTH': { queue: 'north.ras', priority: 2, ack: true },
          'SOUTH': { queue: 'south.ras', priority: 2, ack: false },
          'CLINIC': { queue: 'clinic.ras', priority: 3, ack: false }
        };
        var site = msg['MSH']['MSH.4']['MSH.4.1'].toString();
        var route = routing[site];
        if (route == undefined) {
          route = { queue: 'unrouted.ras', priority: 9, ack: false };
          logger.warn('unrouted RAS from ' + site);
        }
        channelMap.put('route_4', route.queue);
        channelMap.put('priority_4', route.priority);

        // Timestamp normalisation: Mosaiq sends local time without an offset.
        var stamp = msg['MSH']['MSH.7']['MSH.7.1'].toString();
        if (stamp.length == 14) {
          channelMap.put('event_time_4',
            stamp.substring(0, 4) + '-' + stamp.substring(4, 6) + '-' + stamp.substring(6, 8) +
            'T' + stamp.substring(8, 10) + ':' + stamp.substring(10, 12) + ':' + stamp.substring(12, 14));
        } else {
          channelMap.put('event_time_4', DateUtil.getCurrentDate('yyyy-MM-dd HH:mm:ss'));
        }
        