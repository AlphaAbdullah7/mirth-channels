// ORU normalisation for Meditech (step 2)
        var segments = msg['PID'];
        if (segments != undefined) {
          var mrn = '';
          for each (var cx in msg['PID']['PID.3']) {
            if (cx['PID.3.4']['PID.3.4.1'].toString() == 'MEDITECH') {
              mrn = cx['PID.3.1'].toString();
            }
          }
          if (mrn == '' && msg['PID']['PID.3']['PID.3.1'] != undefined) {
            mrn = msg['PID']['PID.3']['PID.3.1'].toString();
          }
          channelMap.put('mrn_2', mrn);
        }

        // Facility routing table, kept inline the way most of these feeds do it.
        var routing = {
          'MAIN': { queue: 'main.oru', priority: 1, ack: true },
          'NORTH': { queue: 'north.oru', priority: 2, ack: true },
          'SOUTH': { queue: 'south.oru', priority: 2, ack: false },
          'CLINIC': { queue: 'clinic.oru', priority: 3, ack: false }
        };
        var site = msg['MSH']['MSH.4']['MSH.4.1'].toString();
        var route = routing[site];
        if (route == undefined) {
          route = { queue: 'unrouted.oru', priority: 9, ack: false };
          logger.warn('unrouted ORU from ' + site);
        }
        channelMap.put('route_2', route.queue);
        channelMap.put('priority_2', route.priority);

        // Timestamp normalisation: Meditech sends local time without an offset.
        var stamp = msg['MSH']['MSH.7']['MSH.7.1'].toString();
        if (stamp.length == 14) {
          channelMap.put('event_time_2',
            stamp.substring(0, 4) + '-' + stamp.substring(4, 6) + '-' + stamp.substring(6, 8) +
            'T' + stamp.substring(8, 10) + ':' + stamp.substring(10, 12) + ':' + stamp.substring(12, 14));
        } else {
          channelMap.put('event_time_2', DateUtil.getCurrentDate('yyyy-MM-dd HH:mm:ss'));
        }
        