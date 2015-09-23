package com.netease.qa.log.storm.bolts.nginx;

import java.util.ArrayList;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import backtype.storm.task.OutputCollector;
import backtype.storm.task.TopologyContext;
import backtype.storm.topology.IRichBolt;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.tuple.Fields;
import backtype.storm.tuple.Tuple;
import backtype.storm.tuple.Values;

import com.netease.qa.log.storm.service.nginx.FilterService;

public class FilterUrl implements IRichBolt {

	private static final long serialVersionUID = 1L;
	private OutputCollector collector;
	private static final Logger logger = LoggerFactory.getLogger(FilterUrl.class);

	public void prepare(@SuppressWarnings("rawtypes") Map stormConf, TopologyContext context, OutputCollector collector) {
		this.collector = collector;
	}

	public void execute(Tuple input) {
		// normalizer the record
		String fullUrl = input.getString(3);
		String[] urls = fullUrl.split(" ");
		String urlTemp = urls[1].trim();
		String[] urlsTemp = urlTemp.split("\\?");
		String url = urlsTemp[0].trim();
		FilterService fs = new FilterService();
		boolean isFilter = fs.filterStaticUrl(url);
		ArrayList<Tuple> a = new ArrayList<Tuple>();
		a.add(input);
		if (isFilter) {
			logger.info("get nginx log: " + input.getString(0) + " " + url);
			collector.emit( new Values(input.getValue(0), input.getValue(1), input.getValue(2), url, input.getValue(4), input
					.getValue(5), input.getValue(6), input.getValue(7)));
		}
	}

	public void cleanup() {

	}

	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		// TODO Auto-generated method stub
		declarer.declare(new Fields("LogSource_id", "Remote_addr", "Time_local", "Request", "Status", "Byte_length", "Request_time", "upstream_response_time"));
	}

	public Map<String, Object> getComponentConfiguration() {
		// TODO Auto-generated method stub
		return null;
	}

}