import sys

def wordlist_filter(word):
    if len(word) is 0: return False
    if word[0] is "#": return False
    return True

def main():
    if len(sys.argv) > 1:
        try:
            if sys.argv[1] == "genre":
                output = list(filter(wordlist_filter, open("wordlists/genre/main").read().split("\n")))
                main_len = len(output)
                for i in range(main_len):
                    output += list(filter(wordlist_filter, open("wordlists/genre/" + output[i])))
                output = sorted(list(set(output)))
            else:
                output = sorted(list(filter(wordlist_filter, open("wordlists/" + sys.argv[1]).read().split("\n"))))
            for i in range(len(output)):
                output[i] = output[i].replace("\n", "")
            print(",".join(output))
        except:
            print("false")
    else:
        print("false")
    sys.stdout.flush()


if __name__ == "__main__":
    main()