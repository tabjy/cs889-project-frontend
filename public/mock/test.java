	public Void call() throws Exception
	{		
		PointCostPair pair = optimizer.minimize(
		 costFunction, 
		 maxEvaluations, 
		 checker, 
		 vertexA,
		 vertexB
		 );
		queueInX.add(pair.getPoint());
		terminated = true;
		// it is the same condition used to say that new x values are available, but now they
		// are null.
		return (Void)null;
	}
