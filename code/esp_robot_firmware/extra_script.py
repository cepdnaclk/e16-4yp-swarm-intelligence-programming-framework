Import("env")

env.Replace(PROGNAME="firmware_%s" % env.GetProjectOption("rob_id"))