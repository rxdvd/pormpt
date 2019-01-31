import sys
from rng.mersenne_twister import MT19937

# to-do
# generator should not be built until lists are complete

'''
ideas:

more normal components should have higher chance
e.g. 4/4 should have a higher chance to appear
e.g. main genres should have a higher chance to appear
e.g. major, minor, harmonic, etc. scales should have higher chance

main genres should have a low chance to branch into sub-genres
e.g. rock is chosen, then has a 0.2 (or similar) chance to pick a
     rock sub-genre else just "rock" is shown

make game optional, possibly with an arg

certain components can be ruled out by passing a string parameter of components to avoid
these components can be filtered out of lists before randomization

3/4 polyrhythmic medium fast spooky symphonic metal sonata in C# Harmonic Minor arranged for cello

3/4
medium fast
sonata
C# Harmonic Minor
polyrhythmic
cello
Kingdom Hearts
spooky
symphonic metal
'''
mt = MT19937()

flags = {
    "g": "genre",
    "e": "emotive_adj",
    "G": "game",
    "i": "instr",
    "r": "rhythm_adj",
    "S": "scale",
    "s": "style",
    "t": "tempo",
    "T": "time_sig",
    "k": "key_sig",
    "x": "keywords",
    "A": "all"
}

exclude = {
    "all": True,
    "genre": True,
    "emotive_adj": True,
    "game": True,
    "instr": True,
    "rhythm_adj": True,
    "scale": True,
    "style": True,
    "tempo": True,
    "time_sig": True,
    "key_sig": True,
    "keywords": []
}

def wordlist_filter(word):
    global exclude
    if len(word) is 0: return False
    if word[0] is "#": return False
    if exclude["keywords"].count(word) > 0: return False
    return True

def randomize_wordlist(path):
    global mt
    wordlist = list(filter(wordlist_filter, open("wordlists/" + path).read().split("\n")))
    return wordlist[mt.rand_int(0, len(wordlist))] if bool(len(wordlist)) else False

def generate():
    global mt
    global exclude
    output = ["time_sig", "rhythm_adj", "tempo", "emotive_adj", "game", "genre", "style", "key_sig", "scale", "instr"]
    for i in range(len(output)):
        if not exclude[output[i]] or not exclude["all"]:
            if i == 5:
                if mt.rand() < 0.2:
                    output[i] = randomize_wordlist("genre/main")
                else:
                    output[i] = randomize_wordlist("genre/" + randomize_wordlist("genre/main"))
            else: 
                output[i] = randomize_wordlist(output[i])
                if output[i] == False: continue
                if i == 7:
                    output[i] = "in " + output[i]
                if i == 9:
                    output[i] = "for " + output[i]
                if i == 2:
                    output[i] += " tempo"
        else:
            output[i] = False
    return ",".join(list(map(format, output)))
    # return list(filter(bool, output))

def isFlag(arg):
    if type(arg) is str:
        if arg[0] == "-" and len(arg) > 1:
            return arg[1:]
    return False

def main():
    # parse flags
    global exclude
    for i in range (1, len(sys.argv)):
        flag = isFlag(sys.argv[i])
        if not flag:
            continue
        if flag == "x":
            try:
                if isFlag(sys.argv[i + 1]) == False:
                    exclude["keywords"] = sys.argv[i + 1].split(",")
            except:
                break
        else:
            exclude[flags[flag]] = False

    print(generate())
    sys.stdout.flush()

if __name__ == "__main__":
    main()
